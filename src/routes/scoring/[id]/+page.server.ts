import { Types } from "mongoose";
import { Series } from "../../../models/Series";
import type { Player, Match } from '../../../types';

import type { Actions, Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  const series = await Series.findOne({ 'matches._id': params.id },
    { matches: 1 })
    .populate('players')
    .lean();
  if (!series) {
    return { acknowledge: false, matches: [], players: [] }
  }
  const { matches, players } = JSON.parse(JSON.stringify(series));
  const match = matches.find((item: (Match & { _id: string })) => item._id === params.id);

  function mapPlayers(teamPlayers: string[], dataMap: Map<string, string>) {
    return teamPlayers.map((item) => ({
      _id: new Types.ObjectId(item),
      name: dataMap.get(item) // Set the desired name
    }));
  }
  const { aTeam, bTeam } = match
  const dataMap: Map<string, string> = new Map(players.map((item: Player) => [item._id, item.name]));

  const aPlayers = mapPlayers(aTeam.players, dataMap);
  const bPlayers = mapPlayers(bTeam.players, dataMap);

  return {
    acknowledge: true,
    aPlayers: JSON.parse(JSON.stringify(aPlayers)),
    bPlayers: JSON.parse(JSON.stringify(bPlayers)),
    aScore: aTeam.score,
    bScore: bTeam.score,
    match
  };
};

// export const actions: Actions = {
//   store: async ({ request, params }) => {
//     const formData = await request.formData();
//     const data = formData.get('data');
//     const parsed = JSON.parse(data as string)
//     const series = await Series.findOne({ _id: params.id });
//     if (!series)
//       return { success: false }

//     const matches = [...series.matches]
//     let { _id, ...newSave } = parsed
//     if (_id) {
//       _id = new Types.ObjectId(_id)
//       const index = matches.findIndex((item) => item._id && item._id.equals(_id));
//       if (index !== -1) {
//         // Create a new array with the updated item
//         const newArray = matches;
//         newArray[index] = { ...newArray[index], ...parsed };
//         (series as any).matches = newArray
//         console.log("newArray", newArray)
//       }
//     } else {
//       (series as any).matches = [newSave, ...series.matches]
//     }
//     const records = await series.save()
//     return {
//       success: true,
//       records: JSON.parse(JSON.stringify(records.matches))
//     };
//   },

//   // delete: async ({ request }) => {
//   //   const formData = await request.formData();
//   //   const todoId = formData.get('todoId');
//   //   await dbConnect();
//   //   await TodoModel.findByIdAndDelete(todoId);
//   //   await dbDisconnect();

//   //   console.log('Todo deleted: ', todoId);
//   //   return {
//   //     success: true,
//   //   };
//   // },
// };