import {useQuery} from '@tanstack/react-query';
import {getChangeHistory} from '../../../api/service/histories';
import {useParams} from 'react-router-dom';
import {UPDATE_TYPE_MAP} from '../../../constants/constants';
import {ERROR_MESSAGES} from '../../../constants/error';

type UpdateType = keyof typeof UPDATE_TYPE_MAP;
export default function TicketLog() {
  const {id} = useParams<{id: string}>();
  const ticketId = Number(id);

  const {data: logData, isLoading} = useQuery({
    queryKey: ['ticketHistory', ticketId],
    queryFn: () => getChangeHistory(ticketId),
    refetchInterval: 5000, // 10초마다 자동으로 refetch
    staleTime: Infinity, // 데이터를 항상 fresh 상태로 유지
  });

  const getKoreanUpdateType = (updateType: string) => {
    return UPDATE_TYPE_MAP[updateType as UpdateType] || updateType;
  };

  return (
    <div className="flex flex-col gap-1 ">
      <label className="text-body-bold">Log</label>
      <div className="w-full p-5 border border-gray-2 rounded-[4px] bg-white text-subtitle-regular text-gray-15 h-[300px] max-h-[300px] overflow-y-scroll">
        {isLoading ? (
          <div className="text-gray-500 text-center py-4">Loading...</div>
        ) : logData?.content && logData.content.length > 0 ? (
          logData.content.map((log) => (
            <div key={log.id} className="bg-main text-white rounded-md p-4 my-2 flex justify-between">
              <div className="flex gap-4">
                <p className="text-body-bold">#{log.ticketId} </p>
                <p className="text-body-bold">{log.updatedByUsername}님 </p>
                <p className="text-body-regular">{getKoreanUpdateType(log.updateType)}</p>
              </div>
              <p className="text-caption-regular text-right mt-1">{new Date(log.updatedAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-4">{ERROR_MESSAGES.NO_LOG}</div>
        )}
      </div>
    </div>
  );
}
