export function buildMongoFilters(filters = {}) {
    const mongo = {};

    for (const key in filters) {
        const f = filters[key];
        if(typeof f !== 'object' || f === null || !f.operator) {
            mongo[key] = f;
            continue;
        }

        switch(f.operator) {
            case '$gt': case '$gte': case '$lt': case '$lte': case '$ne':
                mongo[key] = { [f.operator]: f.value };
                break;
            
            case 'between':
                mongo[key] = { $gte: f.min, $lte: f.max };
                break;
            
            case 'contains':
                mongo[key] = { $regex: f.value, $options: 'i' };
                break;

            default:
                mongo[key] = f.value;
        }
    }

    return mongo;
}
