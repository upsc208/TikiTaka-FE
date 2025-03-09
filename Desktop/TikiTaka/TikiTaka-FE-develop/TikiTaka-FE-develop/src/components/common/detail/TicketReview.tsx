import {useParams} from 'react-router-dom';
import Profile from '../Profile';
import {getTicketReviews, reviewTicket} from '../../../api/service/tickets';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useUserStore} from '../../../store/store';
import {useEffect, useState} from 'react';
import {ERROR_MESSAGES} from '../../../constants/error';

export default function TicketReview({managerId}: {managerId: number}) {
  const {id} = useParams();
  const ticketId = Number(id);
  const [isReviewed, setIsReviewed] = useState(false);
  const queryClient = useQueryClient();

  // 검토 내역 데이터 조회
  const {data: reviewers = []} = useQuery({
    queryKey: ['ticketReviews', ticketId],
    queryFn: () => getTicketReviews(ticketId),
    refetchInterval: 8000, // 8초마다 자동으로 refetch
    staleTime: Infinity, // 데이터를 항상 fresh 상태로 유지
  });

  // 티켓 검토
  const reviewMutation = useMutation({
    mutationFn: () => reviewTicket(ticketId),
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: ['ticketReviews', ticketId]});
      const previousReviews = queryClient.getQueryData(['ticketReviews', ticketId]);

      queryClient.setQueryData(['ticketReviews', ticketId], (old: any) => {
        const newReview = {
          reviewerName: userName,
          reviewed: true,
          reviewDate: new Date().toISOString(),
        };
        return {...old, data: [...(old?.data || []), newReview]};
      });

      return {previousReviews};
    },
    onError: (context: any) => {
      // 에러 발생 시 이전 데이터로 롤백
      queryClient.setQueryData(['ticketReviews', ticketId], context?.previousReviews);
    },
    onSettled: () => {
      // 무조건 리패치하여 서버 데이터와 동기화
      queryClient.invalidateQueries({queryKey: ['ticketReviews', ticketId]});
    },
  });

  const {userId, userName} = useUserStore();
  const isAllowReview = Number(managerId) !== userId;

  useEffect(() => {
    const userReview = reviewers?.data?.find((reviewer: any) => reviewer.reviewerName === userName);
    setIsReviewed(!!userReview);
  }, [reviewers, userName]);

  const handleReview = () => {
    reviewMutation.mutate(undefined, {
      onSuccess: () => {
        setIsReviewed(true);
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-bold">검토 현황</label>
      <div className="w-full p-5 border border-gray-2 rounded-[4px] bg-white text-subtitle-regular text-gray-15">
        <ul className="flex flex-col gap-[7px]">
          {isAllowReview && location.pathname.startsWith('/manager') && (
            <li className="flex justify-between items-center border-b border-b-gray-2 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Profile userId={userId} size="md" />
                <p>{userName}</p>
              </div>
              {isReviewed ? (
                <div className="px-2 text-body-bold">검토 완료</div>
              ) : (
                <button className="main-btn" onClick={handleReview}>
                  검토
                </button>
              )}
            </li>
          )}
          <label className="text-body-bold">검토 내역</label>
          {reviewers?.data && reviewers.data.length > 0 ? (
            reviewers.data.map((reviewer: any, index: number) => (
              <li key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col ml-2">
                    <span>{reviewer.reviewerName}</span>
                    {reviewer.reviewed && <span className="text-caption-regular">{reviewer.reviewDate} 검토 완료</span>}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">{ERROR_MESSAGES.NO_REVIEW}</div>
          )}
        </ul>
      </div>
    </div>
  );
}
