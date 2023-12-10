import { Types } from "mongoose";
import { Series } from "../../../models/Series";
import { User } from '../../../models/User'
import type { Player } from '../../../types';

import type { Actions, Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  const series = await Series.findOne({ _id: params.id })
    .populate('players')
    .lean();
  if (!series) {
    return { acknowledge: false, matches: [], players: [] }
  }
  const { matches, players } = JSON.parse(JSON.stringify(series));
  const dataMap = new Map(players.map((item: Player) => [item._id, item.name]));

  return {
    acknowledge: true,
    matches,
    players,
    playersMap: dataMap
  };
};

export const actions: Actions = {
  store: async ({ request, params }) => {
    const formData = await request.formData();
    const data = formData.get('data');
    const parsed = JSON.parse(data as string)
    const objToSave = {
      ...parsed,
      createdBy: new Types.ObjectId(parsed.createdBy)
    };
    const series = await Series.findOne({ _id: params.id });
    if (!series)
      return { success: false }

    const matches = [...series.matches]
    let { _id, ...newSave } = objToSave
    if (parsed._id) {
      _id = new Types.ObjectId(_id)
      const index = matches.findIndex((item) => item._id && item._id.equals(_id));
      if (index !== -1) {
        // Create a new array with the updated item
        const newArray = matches;
        newArray[index] = { ...newArray[index], ...objToSave };
        (series as any).matches = newArray
        console.log("newArray", newArray)
      }
    } else {
      (series as any).matches = [newSave, ...series.matches]
    }
    const records = await series.save()
    return {
      success: true,
      records: JSON.parse(JSON.stringify(records.matches))
    };
  },

  // delete: async ({ request }) => {
  //   const formData = await request.formData();
  //   const todoId = formData.get('todoId');
  //   await dbConnect();
  //   await TodoModel.findByIdAndDelete(todoId);
  //   await dbDisconnect();

  //   console.log('Todo deleted: ', todoId);
  //   return {
  //     success: true,
  //   };
  // },
};