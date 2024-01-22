import { Types } from "mongoose";
import { Series } from "../models/Series";
import { User } from "../models/User";
import type { Actions, Load } from '@sveltejs/kit';

const getInitSeries = () => {
  return Series.find()
    .populate('players')
    .sort({ createdAt: -1 })
    .lean();
}

export const load: Load = async () => {
  let series = await getInitSeries();
  let members = await User.find().lean();

  if (!series) {
    return { series: [], members: [] }
  }
  return {
    series: JSON.parse(JSON.stringify(series)),
    members: JSON.parse(JSON.stringify(members))
  };
};

export const actions: Actions = {
  store: async ({ request, params }) => {
    const formData = await request.formData();
    const data = formData.get('data');
    const parsed = JSON.parse(data as string)
    let series = null;
    let { _id, ...newSave } = parsed;

    if (_id) {
      series = await Series.findOne({ _id });
      if (series) {
        Object.assign(series, newSave);
      } else {
        console.error('Series not found with _id:', _id);
      }
    } else {
      series = new Series(newSave);
    }

    try {
      const records = series ? await series.save() : [];
      console.log('Series saved successfully:', records);
      return {
        success: true,
        records: JSON.parse(JSON.stringify(records))
      };
    } catch (error) {
      console.error('Error saving series:', error);
      // Handle the error
    }
    return { success: false }
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const est = await Series.findByIdAndDelete(id)
    console.log(est)
    let series = await getInitSeries();
    return {
      success: true,
      records: JSON.parse(JSON.stringify(series)),
    };
  },
}
