const { query, isPgConnected, mockStore } = require('../config/db');

class ListingModel {
  static async findAll({ search, category, state, minPrice, maxPrice, status, sortBy, page = 1, limit = 10, farmerId }) {
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const offset = (page - 1) * limit;

    if (isPgConnected()) {
      let conditions = [];
      let values = [];
      let idx = 1;

      if (search) {
        conditions.push(`(produce_name ILIKE $${idx} OR description ILIKE $${idx} OR location ILIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
      }
      if (category) {
        conditions.push(`category = $${idx}`);
        values.push(category);
        idx++;
      }
      if (state) {
        conditions.push(`(state ILIKE $${idx} OR location ILIKE $${idx})`);
        values.push(`%${state}%`);
        idx++;
      }
      if (minPrice) {
        conditions.push(`price_per_unit >= $${idx}`);
        values.push(parseFloat(minPrice));
        idx++;
      }
      if (maxPrice) {
        conditions.push(`price_per_unit <= $${idx}`);
        values.push(parseFloat(maxPrice));
        idx++;
      }
      if (status) {
        conditions.push(`status = $${idx}`);
        values.push(status);
        idx++;
      } else if (!farmerId) {
        conditions.push(`status = 'available'`);
      }
      if (farmerId) {
        conditions.push(`farmer_id = $${idx}`);
        values.push(parseInt(farmerId));
        idx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      let orderBy = 'l.created_at DESC';
      if (sortBy === 'price_asc') orderBy = 'l.price_per_unit ASC';
      if (sortBy === 'price_desc') orderBy = 'l.price_per_unit DESC';
      if (sortBy === 'newest') orderBy = 'l.created_at DESC';
      if (sortBy === 'oldest') orderBy = 'l.created_at ASC';

      const countSql = `SELECT COUNT(*) FROM listings l ${whereClause}`;
      const dataSql = `
        SELECT l.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email
        FROM listings l
        JOIN users u ON l.farmer_id = u.id
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${idx} OFFSET $${idx + 1}
      `;
      values.push(limit, offset);

      const countRes = await query(countSql, values.slice(0, idx - 1));
      const dataRes = await query(dataSql, values);

      const totalItems = parseInt(countRes.rows[0].count);
      const totalPages = Math.ceil(totalItems / limit);

      return {
        listings: dataRes.rows,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit
        }
      };
    }

    // Fallback Mock Store Filtering
    let results = [...mockStore.listings];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(l =>
        l.produce_name.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        l.location.toLowerCase().includes(q)
      );
    }
    if (category) {
      results = results.filter(l => l.category.toLowerCase() === category.toLowerCase());
    }
    if (state) {
      results = results.filter(l => (l.state && l.state.toLowerCase() === state.toLowerCase()) || l.location.toLowerCase().includes(state.toLowerCase()));
    }
    if (minPrice) {
      results = results.filter(l => Number(l.price_per_unit) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter(l => Number(l.price_per_unit) <= parseFloat(maxPrice));
    }
    if (status) {
      results = results.filter(l => l.status === status);
    } else if (!farmerId) {
      results = results.filter(l => l.status === 'available');
    }
    if (farmerId) {
      results = results.filter(l => l.farmer_id === parseInt(farmerId));
    }

    // Sort
    if (sortBy === 'price_asc') {
      results.sort((a, b) => Number(a.price_per_unit) - Number(b.price_per_unit));
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => Number(b.price_per_unit) - Number(a.price_per_unit));
    } else if (sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else {
      // default newest
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const pagedResults = results.slice(offset, offset + limit).map(l => {
      const farmer = mockStore.users.find(u => u.id === l.farmer_id);
      return {
        ...l,
        farmer_name: farmer ? farmer.name : 'Unknown Farmer',
        farmer_phone: farmer ? farmer.phone : '',
        farmer_email: farmer ? farmer.email : ''
      };
    });

    return {
      listings: pagedResults,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit
      }
    };
  }

  static async findById(id) {
    if (isPgConnected()) {
      const sql = `
        SELECT l.*, u.name as farmer_name, u.phone as farmer_phone, u.email as farmer_email, u.state as farmer_state, u.lga as farmer_lga
        FROM listings l
        JOIN users u ON l.farmer_id = u.id
        WHERE l.id = $1
      `;
      const res = await query(sql, [id]);
      return res.rows[0] || null;
    }

    const listing = mockStore.listings.find(l => l.id === parseInt(id));
    if (!listing) return null;
    const farmer = mockStore.users.find(u => u.id === listing.farmer_id);
    return {
      ...listing,
      farmer_name: farmer ? farmer.name : 'Unknown Farmer',
      farmer_phone: farmer ? farmer.phone : '',
      farmer_email: farmer ? farmer.email : '',
      farmer_state: farmer ? farmer.state : '',
      farmer_lga: farmer ? farmer.lga : ''
    };
  }

  static async create(farmer_id, data) {
    const {
      produce_name,
      category,
      quantity,
      unit,
      price_per_unit,
      location,
      state,
      lga,
      harvest_date,
      photo_url,
      description
    } = data;

    const locString = state && lga ? `${state}, ${lga}` : location;

    if (isPgConnected()) {
      const sql = `
        INSERT INTO listings (
          farmer_id, produce_name, category, quantity, unit,
          price_per_unit, location, state, lga, harvest_date, photo_url, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      const res = await query(sql, [
        farmer_id, produce_name, category, parseFloat(quantity), unit,
        parseFloat(price_per_unit), locString, state || null, lga || null, harvest_date, photo_url || null, description || null
      ]);
      return res.rows[0];
    }

    const newListing = {
      id: mockStore.listings.length + 1,
      farmer_id: parseInt(farmer_id),
      produce_name,
      category,
      quantity: parseFloat(quantity),
      unit,
      price_per_unit: parseFloat(price_per_unit),
      location: locString,
      state: state || '',
      lga: lga || '',
      harvest_date,
      photo_url: photo_url || 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80',
      description: description || '',
      status: 'available',
      created_at: new Date()
    };
    mockStore.listings.unshift(newListing);
    return newListing;
  }

  static async update(id, farmer_id, data) {
    const {
      produce_name,
      category,
      quantity,
      unit,
      price_per_unit,
      location,
      state,
      lga,
      harvest_date,
      photo_url,
      description,
      status
    } = data;

    const locString = state && lga ? `${state}, ${lga}` : location;

    if (isPgConnected()) {
      const sql = `
        UPDATE listings
        SET produce_name = COALESCE($1, produce_name),
            category = COALESCE($2, category),
            quantity = COALESCE($3, quantity),
            unit = COALESCE($4, unit),
            price_per_unit = COALESCE($5, price_per_unit),
            location = COALESCE($6, location),
            state = COALESCE($7, state),
            lga = COALESCE($8, lga),
            harvest_date = COALESCE($9, harvest_date),
            photo_url = COALESCE($10, photo_url),
            description = COALESCE($11, description),
            status = COALESCE($12, status)
        WHERE id = $13 AND farmer_id = $14
        RETURNING *
      `;
      const res = await query(sql, [
        produce_name, category, quantity ? parseFloat(quantity) : null, unit,
        price_per_unit ? parseFloat(price_per_unit) : null, locString, state, lga,
        harvest_date, photo_url, description, status, id, farmer_id
      ]);
      return res.rows[0] || null;
    }

    const listingIndex = mockStore.listings.findIndex(l => l.id === parseInt(id) && l.farmer_id === parseInt(farmer_id));
    if (listingIndex === -1) return null;

    const existing = mockStore.listings[listingIndex];
    const updated = {
      ...existing,
      produce_name: produce_name !== undefined ? produce_name : existing.produce_name,
      category: category !== undefined ? category : existing.category,
      quantity: quantity !== undefined ? parseFloat(quantity) : existing.quantity,
      unit: unit !== undefined ? unit : existing.unit,
      price_per_unit: price_per_unit !== undefined ? parseFloat(price_per_unit) : existing.price_per_unit,
      location: locString || existing.location,
      state: state !== undefined ? state : existing.state,
      lga: lga !== undefined ? lga : existing.lga,
      harvest_date: harvest_date !== undefined ? harvest_date : existing.harvest_date,
      photo_url: photo_url !== undefined ? photo_url : existing.photo_url,
      description: description !== undefined ? description : existing.description,
      status: status !== undefined ? status : existing.status
    };

    mockStore.listings[listingIndex] = updated;
    return updated;
  }

  static async markSoldOut(id, farmer_id) {
    return this.update(id, farmer_id, { status: 'sold_out' });
  }

  static async delete(id, farmer_id) {
    if (isPgConnected()) {
      const res = await query('DELETE FROM listings WHERE id = $1 AND farmer_id = $2 RETURNING id', [id, farmer_id]);
      return res.rowCount > 0;
    }

    const initialLen = mockStore.listings.length;
    mockStore.listings = mockStore.listings.filter(l => !(l.id === parseInt(id) && l.farmer_id === parseInt(farmer_id)));
    return mockStore.listings.length < initialLen;
  }
}

module.exports = ListingModel;
