import { useEffect, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { RealtimeTrajectory } from "mobility-toolbox-js/types";

function useRealtimeRenderedTrajectories(trainId: number | string) {
  const { realtimeLayer } = useMapContext();
  const [trajectory, setTrajectory] = useState<RealtimeTrajectory>();
  const [trainIdFound, setTrainIdFound] = useState<string>();

  // We try to find the trainId every second until we have it
  // TODO: find a efficient way to find the trajectory without polling
  useEffect(() => {
    if (trainIdFound || !trainId || !realtimeLayer) {
      return;
    }
    const timeout = setInterval(() => {
      let traj = realtimeLayer?.trajectories?.[trainId];

      if (!traj) {
        traj = Object.values(realtimeLayer?.trajectories)?.find((item) => {
          return item.properties.route_identifier === trainId;
        });
      }

      if (traj) {
        setTrajectory(traj);
        setTrainIdFound(traj.properties.train_id);
      }
    }, 1000);

    return () => {
      clearInterval(timeout);
      setTrainIdFound(undefined);
    };
  }, [trainId, realtimeLayer, trainIdFound]);

  return trajectory;
}

export default useRealtimeRenderedTrajectories;
