import Types from 'mongoose';

export const create = async (Model, profile) => {
    try {
        const data = await new Model(profile).save();
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const findwithCondition = async (Model, profile) => {
    try {
        const data = await Model.findOne(profile).lean();
        return data;
    } catch (err) {
        console.log(err, "kkkkk");
        return false;
    }
};


export const updateManyByConditions = async (Model, condition, content) => {
    try {
        const data = await Model.updateMany(condition, content);
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const updateByCondition = async (Model, condition, content) => {
    try {
        const data = await Model.updateOne(condition, content);
        return data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const getById = async (Model, _id, projection) => {
    try {
        const data = await Model.findById(_id, projection).lean();
        return data;
    } catch (error) {
        return false;
    }
};

export const getByCondition = async (Model, condition, sort) => {
    try {
        const data = await Model.findOne(condition, sort).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};

export const findOne = async (Model, condition) => {
    try {
        const data = await Model.findOne(condition).lean();
        return data;
    } catch (error) {
        return false;
    }
};

export const findOneAndDelete = async (Model, condition) => {
    try {
        const data = await Model.deleteOne(condition).lean();
        return data;
    } catch (error) {
        return false;
    }
};

export const getByConditionFields = async (Model, condition, projection) => {
    try {
        const data = await Model.findOne(condition, projection).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};

export const getAllByConditionFields = async (Model, condition, projection, sort) => {
    try {
        const data = await Model.find(condition, projection).sort(sort).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};

export const getByConditionBySort = async (Model, condition) => {
    try {
        const data = await Model.findOne(condition).sort({ displayOrder: -1 }).limit(1);
        return data || null;
    } catch (error) {
        return false;
    }
};

export const removeById = async (Model, id) => {
    try {
        const data = await Model.findByIdAndRemove(id);
        return data;
    } catch (error) {
        return false;
    }
};

export const findOneAndUpdate = async (Model, id, profile) => {
    try {

        const data = await Model.findOneAndUpdate(
            { _id: id },
            { $set: profile },
            { new: true }
        );
        return data;
    } catch (error) {
        console.log(error.message)
        return false;
    }
};

export const findOneAndUpdateWithOtherKey = async (Model, id, profile) => {
    try {

        const data = await Model.findOneAndUpdate(
            id,
            { $set: profile },
            { new: true }
        );
        return data;
    } catch (error) {
        console.log(error.message)
        return false;
    }
};


export const findOneAndUpdateWithPopulatedData = async (Model, id, profile, populate) => {
    try {
        const data = await Model.findOneAndUpdate(
            { _id: id },
            { $set: profile },
            { new: true, populate: populate }
        )
        return data;
    } catch (error) {
        console.log(error.message)
        return false;
    }
};

export const updateFavouriteById = async (Model, id, profile) => {
    try {
        const data = await Model.findByIdAndUpdate(
            Types.ObjectId(id),
            profile
        );
        return data;
    } catch (error) {
        return false;
    }
};

export const incrementById = async (Model, id, profile) => {
    try {
        const data = await Model.findByIdAndUpdate(
            Types.ObjectId(id),
            { $inc: profile }
        );
        return data;
    } catch (error) {
        return false;
    }
};

export const insertManyData = async (Model, content) => {
    try {
        const data = await Model.insertMany(content);
        return data || null;
    } catch (err) {
        return false;
    }
};

export const deleteByField = async (Model, content) => {
    try {
        const data = await Model.findOneAndRemove(content);
        return data || null;
    } catch (error) {
        return false;
    }
};

export const count = async (Model, condition) => {
    try {
        const data = await Model.countDocuments(condition).lean();
        return data || 0;
    } catch (error) {
        return false;
    }
};

export const getManyByCondition = async (Model, condition, projection, sortCondition, skip, limit) => {
    try {
        const data = await Model.find(condition, projection).sort(sortCondition).skip(skip).limit(limit).lean();
        return data;
    } catch (error) {
        return false;
    }
};

export const updateCountByCondition = async (Model, condition, count) => {
    try {
        const data = await Model.updateOne(
            condition,
            { $inc: count },
            { new: true }
        );
        return data;
    } catch (error) {
        return false;
    }
};

export const deleteByCondition = async (Model, condition) => {
    try {
        const data = await Model.findByIdAndRemove(condition);
        return data;
    } catch (error) {
        return false;
    }
};

export const incrementManyByCondition = async (Model, condition, content) => {
    try {
        const data = await Model.updateMany(condition, { $inc: content });
        return data;
    } catch (err) {
        return false;
    }
};

export const getAll = async (Model, condition) => {
    try {
        const data = await Model.find(condition).lean();
        return data || null;
    } catch (error) {
        console.log(error)
        return false;
    }
};

export const findAll = async (Model) => {
    try {
        const data = await Model.find().lean();
        return data || null;
    } catch (error) {
        console.log(error)
        return false;
    }
};
export const deleteMany = async (Model, condition) => {
    try {
        const data = await Model.deleteMany(condition);
        return data || null;
    } catch (error) {
        return false;
    }
};

export const findById = async (Model, _id, project) => {
    try {
        const data = await Model.findById(_id, project).lean();
        return data;
    } catch (error) {
        return false;
    }
};

export const incrementByCondition = async (Model, condition, content) => {
    try {
        const data = await Model.updateOne(condition, { $inc: content });
        return data;
    } catch (err) {
        return false;
    }
};

export const findListWithPopulate = async (Model, condition, projection, populate, populateKey, sort) => {
    try {
        const data = await Model.find(condition, projection).populate(populate, populateKey).sort(sort).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};

export const findListWithPopulateWithoutKey = async (Model, condition, projection, populate, sort) => {
    try {
        const data = await Model.find(condition, projection).populate(populate).sort(sort).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};

export const findOneWithPopulate = async (Model, condition, projection, populate, populateKey) => {
    try {
        const data = await Model.findOne(condition, projection).populate(populate, populateKey).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};

export const findOneWithPopulateWithoutPopulateKey = async (Model, condition, projection, populate) => {
    try {
        const data = await Model.findOne(condition, projection).populate(populate).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};
export const getAllByConditionFieldsBySorting = async (Model, condition, sort) => {
    try {
        const data = await Model.find(condition).sort(sort).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};

export const getAllByConditionFieldsWithProjectionAndSorting = async (Model, condition, project, sort) => {
    try {
        const data = await Model.find(condition, project).sort(sort).lean();
        return data || null;
    } catch (error) {
        return false;
    }
};