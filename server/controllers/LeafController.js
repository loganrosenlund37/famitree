const { aql } = require('arangojs');
const db = require('../../database/index');

const getLeafs = async (req, res) => {
  const query = `FOR l IN leafs
    SORT RAND()
    LIMIT 10
    RETURN {
      label: l.label,
      value: l.value,
      _id: l._id,
      dob: l.dob,
    }`;

  try {
    const leafs = await db.query(query);
    const result = await leafs.all();
    res.send(result);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.sendStatus(500);
  }
};

const getLeaf = async (req, res) => {
  const leafID = req.query.id;
  const query = `FOR l IN leafs
  FILTER l._id == '${leafID}'
  RETURN {
    label: l.label,
    _id: l._id,
    dob: l.dob,
  }`;

  try {
    const leaf = {};
    let data = await db.query(query);
    data = await data.all();
    Object.keys(data[0]).forEach((key) => { if (key !== '_rev') leaf[key] = data[0][key]; });

    // Add spouse, father, mother, and children to leaf obj
    const spouseQuery = aql`FOR v, e, p IN 1..1 OUTBOUND
      ${leaf._id}
      GRAPH 'relationships'
      FILTER e.type == 'married'
      RETURN {
        label: v.label,
        dob: v.dob,
        value: v.value,
        _id: v._id
      }`;

    let spouse = await db.query(spouseQuery);
    spouse = await spouse.all();
    if (spouse.length > 0) [leaf.spouse] = spouse;

    const fatherQuery = aql`FOR v, e, p IN 1..1 OUTBOUND
      ${leaf._id}
      GRAPH 'relationships'
      FILTER e.type == 'child'
      FILTER e.parent == 'father'
      RETURN {
        label: v.label,
        dob: v.dob,
        value: v.value,
        _id: v._id
      }`;

    let father = await db.query(fatherQuery);
    father = await father.all();
    if (father.length > 0) [leaf.father] = father;

    const motherQuery = aql`FOR v, e, p IN 1..1 OUTBOUND
      ${leaf._id}
      GRAPH 'relationships'
      FILTER e.type == 'child'
      FILTER e.parent == 'mother'
      RETURN {
        label: v.label,
        dob: v.dob,
        value: v.value,
        _id: v._id
      }`;

    let mother = await db.query(motherQuery);
    mother = await mother.all();
    if (mother.length > 0) [leaf.mother] = mother;

    if (leaf.father?._id) {
      const siblingQuery = aql`FOR v, e, p IN 1..1 INBOUND
        ${leaf.father._id}
        GRAPH 'relationships'
        FILTER e.type == 'child'
        FILTER v._id != ${leaf._id}
        SORT v.dob ASC
        RETURN {
          label: v.label,
          dob: v.dob,
          value: v.value,
          _id: v._id
        }`;

      let siblings = await db.query(siblingQuery);
      siblings = await siblings.all();
      if (siblings.length > 0) leaf.siblings = siblings;
    }

    const childrenQuery = aql`FOR v, e, p IN 1..1 INBOUND
    ${leafID}
    GRAPH 'relationships'
    FILTER e.type == 'child'
    SORT v.dob ASC
    RETURN {
      label: v.label,
      _id: v._id,
    }`;

    let children = await db.query(childrenQuery);
    children = await children.all();
    if (children.length > 0) leaf.children = children;

    res.send(leaf);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.sendStatus(500);
  }
};

const addLeaf = async (req, res) => {
  const {
    leaf, father, mother, spouse,
  } = req.body;
  const { label, dob, value } = leaf;

  const fields = [];
  if (label) fields.push(aql`label: ${label},`);
  if (dob) fields.push(aql`dob: ${dob},`);
  if (value) fields.push(aql`value: ${value}`);

  const query = aql`
    INSERT {
    ${aql.join(fields)}
    } INTO leafs
    RETURN NEW._id
    `;

  try {
    let inserted = await db.query(query, leaf);
    inserted = await inserted.all();

    // Create edge between leaf and other already created leafs with appropriate relationships
    if (spouse) {
      let spouseLink = aql`
      INSERT {
        _from: ${inserted[0]},
        _to: ${spouse._id},
        type: 'married',
        vertex: ${inserted[0]}
      } INTO relations`;
      db.query(spouseLink);
      spouseLink = aql`
      INSERT {
        _from: ${spouse._id},
        _to: ${inserted[0]},
        type: 'married',
        vertex: ${spouse._id}
      } INTO relations`;
      db.query(spouseLink);
    }
    if (father) {
      const fatherLink = aql`
      INSERT {
        _from: ${inserted[0]},
        _to: ${father._id},
        type: 'child',
        parent: 'father',
        vertex: ${inserted[0]}
      } INTO relations`;
      db.query(fatherLink);
    }
    if (mother) {
      const motherLink = aql`
      INSERT {
        _from: ${inserted[0]},
        _to: ${mother._id},
        type: 'child',
        parent: 'mother',
        vertex: ${inserted[0]}
      } INTO relations`;
      db.query(motherLink);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.sendStatus(500);
  }
};

const editLeaf = async (req, res) => {
  const {
    father, mother, spouse,
  } = req.body;
  const leafID = req.body.id;
  const { label, dob, value } = req.body.leaf;

  const fields = [];
  if (label) fields.push(aql`label: ${label},`);
  if (dob) fields.push(aql`dob: ${dob},`);
  if (value) fields.push(aql`value: ${value}`);

  const query = aql`
  FOR leaf IN leafs
    FILTER leaf._id == ${leafID}
    UPDATE leaf WITH {
      ${aql.join(fields)}
    } IN leafs
    RETURN NEW
  `;

  try {
    db.query(query);

    if (spouse) {
      const lsQuery = aql`
        FOR v, e, p IN 1..1 ANY
        ${leafID}
        GRAPH 'relationships'
        FILTER e.type == 'married'
        RETURN e`;
      // const spouseQuery = aql`
      //   FOR v, e, p IN 1..1 ANY
      //   ${spouse._id}
      //   GRAPH 'relationships'
      //   FILTER e.type == 'married'
      //   RETURN e`;

      let lsLink = await db.query(lsQuery);
      lsLink = await lsLink.all();
      // let sLink = await db.query(spouseQuery);
      // sLink = await sLink.all();

      if (lsLink.length == 0) {
        let spouseLink = aql`
        INSERT {
          _from: ${leafID},
          _to: ${spouse._id},
          type: 'married',
          vertex: ${leafID}
        } INTO relations`;
        db.query(spouseLink);
        spouseLink = aql`
        INSERT {
          _from: ${spouse._id},
          _to: ${leafID},
          type: 'married',
          vertex: ${spouse._id}
        } INTO relations`;
        db.query(spouseLink);
      } else {
        // Check if spouse already has a spouse
        console.log('Leaf already has a spouse.');
      }
    } else {
      // check if spouse edges exist and remove if necessary
      const lsQuery = aql`
      FOR v, e, p IN 1..1 ANY
      ${leafID}
      GRAPH 'relationships'
      FILTER e.type == 'married'
      REMOVE e._key IN 'relations'`;
      db.query(lsQuery);
    }
    if (father) {
      const lfQuery = aql`
      FOR v, e, p IN 1..1 ANY
      ${leafID}
      GRAPH 'relationships'
      FILTER e.type == 'child' && e.parent == 'father'
      RETURN e`;

      let lfLink = await db.query(lfQuery);
      lfLink = await lfLink.all();

      if (lfLink.length == 0) {
        const fatherLink = aql`
        INSERT {
          _from: ${leafID},
          _to: ${father._id},
          type: 'child',
          parent: 'father',
          vertex: ${leafID}
        } INTO relations`;
        db.query(fatherLink);
      } else {
        let stillAdd = true;
        lfLink.forEach((link) => {
          if (link._from == leafID) stillAdd = false;
        });
        if (stillAdd) {
          const fatherLink = aql`
            INSERT {
              _from: ${leafID},
              _to: ${father._id},
              type: 'child',
              parent: 'father',
              vertex: ${leafID}
            } INTO relations`;
          db.query(fatherLink);
        }
      }
    } else {
      // check if father edges exist and remove if necessary
      const lsQuery = aql`
      FOR v, e, p IN 1..1 OUTBOUND
      ${leafID}
      GRAPH 'relationships'
      FILTER e.type == 'child'
      REMOVE e._key IN 'relations'`;
      db.query(lsQuery);
    }
    if (mother) {
      const lmQuery = aql`
      FOR v, e, p IN 1..1 ANY
      ${leafID}
      GRAPH 'relationships'
      FILTER e.type == 'child' && e.parent == 'mother'
      RETURN e`;

      let lmLink = await db.query(lmQuery);
      lmLink = await lmLink.all();

      if (lmLink.length == 0) {
        const motherLink = aql`
        INSERT {
          _from: ${leafID},
          _to: ${mother._id},
          type: 'child',
          parent: 'mother',
          vertex: ${leafID}
        } INTO relations`;
        db.query(motherLink);
      } else {
        let stillAdd = true;
        lmLink.forEach((link) => {
          if (link._from == leafID) stillAdd = false;
        });
        if (stillAdd) {
          const motherLink = aql`
            INSERT {
              _from: ${leafID},
              _to: ${mother._id},
              type: 'child',
              parent: 'mother',
              vertex: ${leafID}
            } INTO relations`;
          db.query(motherLink);
        }
      }
    } else {
      // check if mother edges exist and remove if necessary
      const lsQuery = aql`
        FOR v, e, p IN 1..1 OUTBOUND
        ${leafID}
        GRAPH 'relationships'
        FILTER e.type == 'child'
        REMOVE e._key IN 'relations'`;
      db.query(lsQuery);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.sendStatus(500);
  }
};

const addSpouseOrParent = async (req, res) => {
  const { label, value } = req.body;
  const query = aql`INSERT {
      label: ${label},
      value: ${value}
    } INTO leafs
    LET inserted = NEW
    RETURN inserted._id`;

  try {
    const inserted = await db.query(query);
    const result = await inserted.all();
    res.send(result[0]);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.sendStatus(500);
  }
};

const searchLeafs = async (req, res) => {
  let { val } = req.query;
  val = `%${val}%`;

  const query = aql`
    FOR leaf IN leafs
      FILTER LIKE(LOWER(leaf.label), LOWER(${val}))
      LIMIT 10
      RETURN {
        label: leaf.label,
        dob: leaf.dob,
        _id: leaf._id,
        value: leaf.value
      }`;

  let search = await db.query(query);
  search = await search.all();

  res.send(search);
};

module.exports = {
  getLeafs,
  getLeaf,
  addLeaf,
  editLeaf,
  addSpouseOrParent,
  searchLeafs,
};
