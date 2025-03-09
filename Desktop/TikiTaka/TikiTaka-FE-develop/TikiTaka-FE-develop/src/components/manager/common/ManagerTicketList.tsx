import {useEffect, useRef, useState} from 'react';
import {approveTicket, getTicketList, rejectTicket, updateTicketStatus, getTicketTypes} from '../../../api/service/tickets';
import {useUserStore} from '../../../store/store';
import Dropdown from '../../common/Dropdown';
import PageNations from '../../common/PageNations';
import DashTicket from './DashTicket';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {toast} from 'react-toastify';
import {getManagerList} from '../../../api/service/users';
import {getCategoryList} from '../../../api/service/categories';
import {RefreshIcon} from '../../common/Icon';
import {ITEMS_PER_PAGE, mapFilterToStatus, pageSizeOptions, typeNameMapping} from '../../../constants/constants';
import {ERROR_MESSAGES} from '../../../constants/error';
import {motion} from 'framer-motion';

interface TicketListProps {
  selectedFilter: string;
  ticketCounts: TicketStatusCount | null;
}

export default function ManagerTicketList({selectedFilter, ticketCounts}: TicketListProps) {
  const role = useUserStore((state) => state.role).toLowerCase();
  const [filteredTickets, setFilteredTickets] = useState<TicketListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string}>({});
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [orderBy, setOrderBy] = useState('최신순');
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPageChanged, setIsPageChanged] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  useEffect(() => {
    if (isPageChanged && containerRef.current) {
      containerRef.current.scrollIntoView({behavior: 'smooth'});
      setIsPageChanged(false); // 페이지 변경시에만 작동하도록 수정
    }
  }, [isPageChanged]);

  useEffect(() => {
    if (selectedFilter === '긴급') {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [selectedFilter]);

  const {data: userData} = useQuery({queryKey: ['managers'], queryFn: getManagerList, select: (data) => data.users});

  const {data: typeData} = useQuery({queryKey: ['types'], queryFn: getTicketTypes});

  const {data: categories = []} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const primaryCategories = await getCategoryList();
      const secondaryRequests = primaryCategories.map(async (primary) => {
        const secondaries = await getCategoryList(primary.id);
        return {primary, secondaries};
      });

      return Promise.all(secondaryRequests);
    },
  });

  const {data} = useQuery({
    queryKey: [
      'tickets',
      selectedFilter ?? '',
      currentPage ?? 1,
      pageSize ?? ITEMS_PER_PAGE,
      orderBy ?? '최신순',
      selectedFilters['담당자'],
      selectedFilters['1차 카테고리'],
      selectedFilters['2차 카테고리'],
      selectedFilters['요청'],
    ],
    queryFn: async () => {
      const statusParam = mapFilterToStatus(selectedFilter ?? '전체');

      const urgent = selectedFilter === '긴급' ? true : undefined;

      const managerId = userData?.find((user: any) => user.username === selectedFilters['담당자'])?.userId;
      const firstCategoryId = categories?.find((cat: any) => cat.primary.name === selectedFilters['1차 카테고리'])?.primary.id;
      const secondCategoryId = categories
        ?.find((cat: any) => cat.primary.name === selectedFilters['1차 카테고리'])
        ?.secondaries.find((sub: any) => sub.name === selectedFilters['2차 카테고리'])?.id;
      const ticketTypeId = typeData?.find((type: any) => type.typeName === selectedFilters['요청'])?.typeId;

      const sortParam =
        orderBy === '최신순' ? 'newest' : orderBy === '마감기한순' ? 'deadline' : orderBy === '오래된순' ? 'oldest' : 'newest';

      const ticketData = await getTicketList({
        page: (currentPage ?? 1) - 1,
        size: pageSize ?? ITEMS_PER_PAGE,
        status: statusParam,
        managerId,
        firstCategoryId,
        secondCategoryId,
        ticketTypeId,
        urgent,
        sort: sortParam,
      });

      let sortedTickets = [...ticketData.content];

      return {...ticketData, content: sortedTickets};
    },
  });

  const dropdownData = [
    {label: '담당자', options: userData?.map((user: any) => user.username)},
    {label: '1차 카테고리', options: categories.map((cat: any) => cat.primary.name)},
    {
      label: '2차 카테고리',
      options: selectedFilters['1차 카테고리']
        ? (categories
            .find((cat: any) => cat.primary.name === selectedFilters['1차 카테고리'])
            ?.secondaries.map((secondary: any) => secondary.name) ?? [])
        : [],
    },
    {label: '요청', options: typeData?.map((type: any) => typeNameMapping[type.typeName] || type.typeName)},
  ];

  useEffect(() => {
    if (!data?.content) return;

    let filtered = [...data.content];

    if (selectedFilters['담당자']) {
      filtered = filtered.filter((ticket) => ticket.managerName === selectedFilters['담당자']);
    }

    if (selectedFilters['1차 카테고리']) {
      filtered = filtered.filter((ticket) => ticket.firstCategoryName === selectedFilters['1차 카테고리']);
    }

    if (selectedFilters['2차 카테고리']) {
      filtered = filtered.filter((ticket) => ticket.secondCategoryName === selectedFilters['2차 카테고리']);
    }

    if (selectedFilters['요청']) {
      filtered = filtered.filter((ticket) => ticket.typeName === selectedFilters['요청']);
    }

    setFilteredTickets(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize)); // 이 부분을 추가/수정
  }, [selectedFilters, data?.content, pageSize]);

  useEffect(() => {
    if (data?.content) {
      setFilteredTickets(data.content);
    }
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data?.content, data?.totalPages, selectedFilter]);

  const selectedCount = Object.values(selectedFilters).some((filter) => filter)
    ? data?.totalElements || 0
    : ticketCounts
      ? selectedFilter === '전체'
        ? ticketCounts.total
        : selectedFilter === '대기중'
          ? ticketCounts.pending
          : selectedFilter === '진행중'
            ? ticketCounts.inProgress
            : selectedFilter === '검토 요청'
              ? ticketCounts.reviewing
              : selectedFilter === '완료'
                ? ticketCounts.completed
                : selectedFilter === '긴급'
                  ? ticketCounts.urgent
                  : 0
      : 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setIsPageChanged(true);
    }
  };

  const handleSelect = (label: string, value: string) => {
    if (label === '요청') {
      const originalValue = Object.keys(typeNameMapping).find((key) => typeNameMapping[key] === value) || value;
      setSelectedFilters((prev) => ({...prev, [label]: originalValue}));
    } else if (label === '1차 카테고리') {
      setSelectedFilters((prev) => ({...prev, ['1차 카테고리']: value, ['2차 카테고리']: ''}));
    } else {
      setSelectedFilters((prev) => ({...prev, [label]: value}));
    }
  };

  const getDetailLink = (ticketId: number): string => {
    if (role === 'manager') return `/manager/detail/${ticketId}`;
    if (role === 'user') return `/user/detail/${ticketId}`;
    return `/detail/${ticketId}`;
  };

  const approveMutation = useMutation({
    mutationFn: (ticketId: number) => approveTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tickets']});
      queryClient.invalidateQueries({queryKey: ['ticketStatusCounts']});
      toast.success('티켓이 승인되었습니다.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (ticketId: number) => rejectTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tickets']});
      queryClient.invalidateQueries({queryKey: ['ticketStatusCounts']});
      toast.success('티켓이 반려되었습니다.');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ticketId, newStatus}: {ticketId: number; newStatus: string}) => updateTicketStatus(ticketId, newStatus),
    onSuccess: (_, {newStatus}) => {
      queryClient.invalidateQueries({queryKey: ['tickets']});
      queryClient.invalidateQueries({queryKey: ['ticketStatusCounts']});
      const statusMessage: Record<string, string> = {
        PENDING: '티켓 상태가 대기중으로 변경되었습니다.',
        DONE: '티켓 상태가 완료로 변경되었습니다.',
      };

      toast.success(statusMessage[newStatus] || '티켓 상태가 변경되었습니다.');
    },
    onError: () => {
      toast.error('티켓 상태 변경 실패. 다시 시도하세요.');
    },
  });

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    updateStatusMutation.mutate({ticketId, newStatus});
    queryClient.invalidateQueries({queryKey: ['ticketStatusCounts']});
  };

  return (
    <div className="w-full relative mb-[100px] " ref={containerRef}>
      <div className="flex mb-2 justify-end gap-3 ">
        <Dropdown
          label="20개씩"
          options={pageSizeOptions}
          value={`${pageSize}개씩`}
          onSelect={(value) => setPageSize(parseInt(value.replace('개씩', ''), 10))}
          paddingX="px-3"
          border={false}
          textColor=""
        />
        <Dropdown
          label="정렬 기준"
          options={['최신순', '마감기한순', '오래된순']}
          value={orderBy || '정렬 기준'}
          onSelect={(value) => setOrderBy(value)}
          paddingX="px-4"
          border={false}
          textColor=""
        />
      </div>
      <div className="bg-gray-18 h-full flex flex-col justify-start p-4">
        <div className="flex justify-between items-center  mt-4 px-2">
          <div className="flex items-center gap-4 leading-none">
            {dropdownData.map((data) => (
              <Dropdown
                key={data.label}
                label={data.label}
                options={data.options}
                value={
                  data.label === '요청'
                    ? typeNameMapping[selectedFilters[data.label]] || selectedFilters[data.label]
                    : selectedFilters[data.label]
                }
                onSelect={(value) => handleSelect(data.label, value)}
                paddingX="px-3"
                disabled={data.label === '2차 카테고리' && !selectedFilters['1차 카테고리']}
              />
            ))}
            <button
              className=" text-gray-800 rounded-md  transition relative  whitespace-nowrap "
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                setSelectedFilters({});
                setCurrentPage(1);
              }}
            >
              <RefreshIcon />
              {isHovered && (
                <div className="absolute left-0 mt-1 bg-gray-1 border border-gray-2 rounded-md py-1 px-3 text-xs text-gray-15 shadow-md">
                  필터 초기화
                </div>
              )}
            </button>
          </div>
          <div className="ml-auto text-gray-700 text-subtitle">
            조회 건수 <span className="text-black text-title-bold ml-1">{selectedCount}건</span>
          </div>
        </div>

        <div className="flex gap-4 py-2 text-gray-700 text-title-regular mt-5 mb-5 px-2">
          <div className="w-[6%]">티켓 ID</div>
          <div className="w-[14%]">카테고리</div>
          <div className={role === 'user' ? 'w-[51%]' : 'w-[32%]'}>요청 내용</div>
          <div className="w-[12%]">생성 / 마감 기한</div>
          <div className="w-[12%]">담당자</div>
          {role !== 'user' && <div className="w-[15%]">승인 여부</div>}
        </div>

        <div className="flex flex-col gap-4">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <DashTicket
                key={ticket.ticketId}
                {...ticket}
                detailLink={getDetailLink(ticket.ticketId)}
                onApprove={() => approveMutation.mutate(ticket.ticketId)}
                onReject={() => rejectMutation.mutate(ticket.ticketId)}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">{ERROR_MESSAGES.NO_TICKET}</div>
          )}
        </div>

        {filteredTickets.length > 0 && <PageNations currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
      </div>
      {showTooltip && (
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 50}}
          transition={{duration: 0.5}}
          className="fixed bottom-5 right-[700px] transform -translate-x-1/2 text-subtitle-regular bg-main text-white px-20 py-4 rounded-lg shadow-lg z-50"
        >
          긴급 티켓 수는 완료, 반려 처리된 티켓을 제외한 티켓 수입니다.
        </motion.div>
      )}
    </div>
  );
}
