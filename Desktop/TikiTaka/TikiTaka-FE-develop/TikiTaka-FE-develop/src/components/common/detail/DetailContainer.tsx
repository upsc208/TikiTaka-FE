import {useLocation, useNavigate, useParams} from 'react-router-dom';
import TopMenu from '../TopMenu';
import StatusBar from './StatusBar';
import TicketContent from './TicketContent';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import Profile from '../Profile';
import TicketDetail from './TicketDetail';
import TicketSetting from './TicketSetting';
import TicketTask from './TicketTask';
import TicketLog from './TicketLog';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {deleteTicket, getTicketComments, getTicketDetails} from '../../../api/service/tickets';
import {Comment} from '../../../interfaces/interfaces';
import TicketReview from './TicketReview';
import {BackIcon} from '../Icon';
import {useNewTicketStore, useUserStore} from '../../../store/store';
import {useEffect, useState} from 'react';
import Modal from '../Modal';
import TicketEdit from './TicketEdit';
import UserTicketTask from '../../user/UserTicketTask';
import {typeNameMapping} from '../../../constants/constants';
import AttachmentList from './AttachmentList';
import {deleteAttachment} from '../../../api/service/attatchments';

export default function DetailContainer() {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {userId, role} = useUserStore();

  const newData = useNewTicketStore();

  // 뒤로 가기
  const handleGoBack = () => navigate(-1);
  const ticketId = Number(id);

  // 티켓 상세 정보 조회
  const {data: ticket} = useQuery<TicketDetails>({queryKey: ['ticketDetails', ticketId], queryFn: () => getTicketDetails(ticketId)});

  // 파일 삭제 함수
  const handleDeleteAttachment = async (fileId: number) => {
    try {
      await deleteAttachment(fileId);
      queryClient.invalidateQueries({queryKey: ['ticketDetails', ticketId]});
    } catch (error) {
      console.error('첨부파일 삭제 실패:', error);
    }
  };

  //댓글 조회
  const {data: comments} = useQuery({
    queryKey: ['ticketComments', ticketId],
    queryFn: () => getTicketComments(ticketId),
  });

  // 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tickets']});
      if (role === 'USER') navigate('/user');
      else if (role === 'MANAGER') navigate('/manager');
      else navigate('/', {replace: true});
    },
  });

  // 수정 버튼 클릭 시
  const handleEdit = () => {
    newData.setIsEditing?.(!newData.isEditing);
    if (!newData.isEditing && ticket) {
      newData.setTitle(ticket.title);
      newData.setContent(ticket.description);
      newData.setIsUrgent(ticket.urgent);
      newData.setFirstCategoryId(ticket.firstCategoryId);
      newData.setSecondCategoryId(ticket.secondCategoryId);
      newData.setTicketType({typeId: ticket.typeId, typeName: ticket.typeName});
      newData.setDueDate(ticket.deadline.split(' ')[0]);
      newData.setDueTime(ticket.deadline.split(' ')[1]);
      newData.setManagerId(-1);
    } else if (newData.isEditing) {
      newData.setTitle('');
      newData.setContent('');
      newData.setIsUrgent(false);
      newData.setFirstCategoryId(0);
      newData.setSecondCategoryId(0);
      newData.setFirstCategory(null);
      newData.setSecondCategory(null);
      newData.setTicketType({typeId: 0, typeName: ''});
      newData.setDueDate('');
      newData.setDueTime('');
      newData.setManagerId(0);
      newData.setManager(null);
    }
  };

  // 삭제 버튼 클릭 시
  const handleDelete = () => {
    if (ticket?.status === 'PENDING') {
      setShowDeleteModal(true);
    } else {
      alert(`현재 상태에서는 삭제가 불가능합니다.`);
    }
  };

  // 삭제 확정
  const confirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  useEffect(() => {
    newData.setIsEditing(false);
  }, [location.pathname]);

  if (role === 'USER' && ticket && ticket?.requesterId !== userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-lg font-bold gap-4">
        <p>권한이 없습니다.</p>
        <button onClick={handleGoBack} className="text-xs text-gray-6 underline hover:text-gray-15">
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <div className="top-container">
      <div className="flex flex-col">
        <div className="flex flex-col pt-[30px] px-[46px] mb-[100px]">
          <button onClick={handleGoBack} className="flex items-center gap-1 text-body-regular text-gray-16 text-left">
            <BackIcon />
            {'뒤로가기'}
          </button>
          <TopMenu boldBlackText={`#${ticket?.ticketId}`} regularText={`[${typeNameMapping[ticket?.typeName ?? '']}] ${ticket?.title}`} />
          {ticket && (
            <StatusBar data={ticket} status={ticket?.status as 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'REVIEW' | 'REJECTED' | undefined} />
          )}
          {ticket?.requesterId === userId && (
            <div className={`flex justify-end gap-2 text-body-bold mt-3 ${newData.isEditing && 'px-10'}`}>
              <button className="text-gray-5 hover:text-gray-15" onClick={handleEdit}>
                {newData.isEditing ? '수정 취소' : '수정'}
              </button>
              <button
                className={`text-gray-5 ${ticket?.status == 'PENDING' ? 'hover:text-gray-15' : 'cursor-not-allowed'}`}
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
          {newData.isEditing && ticket ? (
            <>
              <div className="flex w-full">
                <TicketEdit ticketData={ticket} />
              </div>
            </>
          ) : (
            <section className="flex bg-gray-18 p-6 pb-[38px] mt-3 w-full">
              <div className="flex gap-4 mr-10">
                <Profile userId={ticket?.requesterId} size="lg" />
                <section className="w-[577px] flex flex-col">
                  {ticket && <TicketContent data={ticket} />}
                  {ticket?.attachments && ticket?.attachments.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <div className="mt-4 tooltip w-fit">첨부된 이미지를 클릭하여 다운로드 가능합니다.</div>
                      <AttachmentList
                        attachments={ticket?.attachments}
                        onDeleteAttachment={handleDeleteAttachment}
                        isOwn={userId === ticket.requesterId}
                      />
                    </div>
                  )}
                  <CommentInput />
                  {comments?.data && comments?.data.length > 0 ? (
                    [...comments.data]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((comment: Comment) => (
                        <CommentItem
                          key={comment.commentId}
                          commentId={comment.commentId}
                          authorId={comment.authorId}
                          name={comment.authorName}
                          content={comment.content}
                          createdAt={comment.createdAt}
                          files={comment.attachments}
                        />
                      ))
                  ) : (
                    <></>
                  )}
                </section>
              </div>
              <section className="flex flex-col gap-5 w-[400px]">
                {ticket && ticket.status === 'REVIEW' && <TicketReview managerId={ticket?.managerId} />}
                {ticket && (
                  <>
                    <TicketDetail data={ticket} />
                    {location.pathname.startsWith('/manager') && <TicketSetting data={ticket} />}
                  </>
                )}

                {location.pathname.startsWith('/user') && <UserTicketTask progress={ticket?.progress} />}
                {location.pathname.startsWith('/manager') && <TicketTask progress={ticket?.progress} />}
                <TicketLog />
              </section>
            </section>
          )}
          {showDeleteModal && (
            <Modal
              title="이 티켓을 삭제하시겠습니까?"
              backBtn="취소"
              onBackBtnClick={() => setShowDeleteModal(false)}
              checkBtn="삭제"
              onBtnClick={confirmDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
