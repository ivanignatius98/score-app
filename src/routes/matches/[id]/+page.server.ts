import { Types } from "mongoose";
import { Series } from "../../../models/Series";

import type { Actions, Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  const series = await Series.findOne({ _id: params.id })
    .populate('players').lean();

  if (!series) {
    return { acknowledge: false, matches: [], players: [] }
  }
  const { matches, players } = JSON.parse(JSON.stringify(series));
  return {
    acknowledge: true,
    matches,
    players
  };
};

export const actions: Actions = {
  create: async ({ request, params }) => {
    const formData = await request.formData();
    const data = formData.get('data');
    const parsed = JSON.parse(data as string)
    const objToSave = {
      ...parsed, createdBy: new Types.ObjectId(parsed.createdBy)
    };
    const series = await Series.findOne({ _id: params.id });
    if (!series)
      return { success: false }

    series.matches = [objToSave, ...series?.matches]
    await series.save()

    console.log(series, parsed)
    return {
      success: true,
    };
  },
  // update: async ({ request }) => {
  //   const formData = await request.formData();
  //   const todoId = formData.get('todoId');
  //   const todoName = formData.get('todoName');
  //   await dbConnect();
  //   await TodoModel.findByIdAndUpdate(todoId, {
  //     title: todoName,
  //   }).lean();
  //   await dbDisconnect();

  //   console.log('Todo updated: ', todoId);

  //   return {
  //     success: true,
  //   };
  // },

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