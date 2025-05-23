import Maid from "../models/Maid.mjs";

export const addMaid = async (req, res) => {
    const { name, mobile, pic, state, city, area, pincode, salary,availability,services } = req.body; 

    const existData = await Maid.findOne({ mobile });

    if (existData) {
        return res.status(400).json({ message: "Maid already exists" });
    }

    const maidBody = {
        name,
        mobile,
        picture : pic,
        state,
        city,
        area,
        pincode,
        salaryPerMonth : salary,
        availability,
        services,
    };

    try {
        const data = await Maid.create(maidBody);
        res.status(201).json({ message: "Maid added successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }

}

export const getMaidsByArea = async (req, res) => {
    const { area, page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;
  
    const filter = area ? { area } : {};
  
    const total = await Maid.countDocuments(filter);
    const maids = await Maid.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ name: 1 });
  
    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      maids,
    });
  };

export const getMaidById = async (req, res) => {
    const { id } = req.body;

    try {
        const maid = await Maid.findById(id);
        if (!maid) {
            return res.status(404).json({ message: "Maid not found" });
        }
        res.status(200).json(maid);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteMaid = async (req, res) => {
    const { id } = req.body;

    console.log("Deleting Maid ID:", id);

    try {
        const maid = await Maid.findById( id );
        if (!maid) {
            return res.status(404).json({ message: "Maid not found" });
        }
        await Maid.deleteOne({ _id: id });
        res.status(200).json({ message: "Maid deleted successfully" , maid });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateMaid = async (req, res) => {
    const { id, name, mobile, picture, state, city, area, pincode, salaryPerMonth } = req.body;

    try {
        const maid = await Maid.findById(id);
        if (!maid) {
            return res.status(404).json({ message: "Maid not found" });
        }

        const updatedMaid = {
            name,
            mobile,
            picture,
            state,
            city,
            area,
            pincode,
            salaryPerMonth
        };

        await Maid.updateOne({ _id: id }, updatedMaid);
        res.status(200).json({ message: "Maid updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}