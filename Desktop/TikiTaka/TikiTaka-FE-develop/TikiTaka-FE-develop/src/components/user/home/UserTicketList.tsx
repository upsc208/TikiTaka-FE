import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useMemo, useRef, useState} from 'react';
import {getCategoryList} from '../../../api/service/categories';
import {getTicketList, getTicketTypes} from '../../../api/service/tickets';
import {getManagerList} from '../../../api/service/users';
import {TicketViewType} from '../../../interfaces/ticket';
import {useUserStore} from '../../../store/store';
import Dropdown from '../../common/Dropdown';
import {RefreshIcon} from '../../common/Icon';
import PageNations from '../../common/PageNations';
import UserTicket from './UserTicket';
import {ERROR_MESSAGES} from '../../../constants/error';
import {ITEMS_PER_PAGE, mapFilterToStatus, pageSizeOptions, typeNameMapping} from '../../../constants/constants';

const typeMapping: Record<string, string> = {CREATE: '생성', DELETE: '삭제', ETC: '기타', UPDATE: '수정'};

interface TicketListProps {
  selectedFilter: TicketViewType;
}

const STATUS_MAP = {PENDING: '대기중', IN_PROGRESS: '진행중', REVIEW: '검토 요청', DONE: '완료', REJECTED: '반려'};

const REVERSE_STATUS_MAP = Object.entries(STATUS_MAP).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {} as Record<string, string>
);

export default function UserTicketList({selectedFilter}: TicketListProps) {
  const role = useUserStore((state) => state.role).toLowerCase();
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [orderBy, setOrderBy] = useState('최신순');
  const listRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const {userId} = useUserStore();

  useEffect(() => {
    setSelectedFilters({});
    setCurrentPage(1);
  }, [selectedFilter]);

  const apiStatus = useMemo(() => {
    if (selectedFilter === '전체') return undefined;
    if (selectedFilter === '긴급') return undefined;
    return REVERSE_STATUS_MAP[selectedFilter] || undefined;
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

  const {data: ticketListResponse} = useQuery({
    queryKey: [
      'ticketList',
      selectedFilter ?? '',
      currentPage ?? 1,
      pageSize ?? ITEMS_PER_PAGE,
      orderBy ?? '최신순',
      selectedFilters['담당자'],
      selectedFilters['1차 카테고리'],
      selectedFilters['2차 카테고리'],
      selectedFilters['요청'],
    ],
    queryFn: () => {
      const statusParam = mapFilterToStatus(selectedFilter ?? '전체');
      const urgent = selectedFilter === '긴급' ? true : undefined;
      const selectedManagerId = userData?.find((user: any) => user.username === selectedFilters['담당자'])?.userId;
      const firstCategoryId = categories?.find((cat: any) => cat.primary.name === selectedFilters['1차 카테고리'])?.primary.id;
      const secondCategoryId = categories
        ?.find((cat: any) => cat.primary.name === selectedFilters['1차 카테고리'])
        ?.secondaries.find((sub: any) => sub.name === selectedFilters['2차 카테고리'])?.id;
      const ticketTypeId = typeData?.find((type: any) => type.typeName === selectedFilters['요청'])?.typeId;

      const sortParam =
        orderBy === '최신순' ? 'newest' : orderBy === '마감기한순' ? 'deadline' : orderBy === '오래된순' ? 'oldest' : 'newest';

      return getTicketList({
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        status: statusParam,
        managerId: selectedManagerId,
        firstCategoryId,
        secondCategoryId,
        ticketTypeId,
        urgent,
        requesterId: userId,
        sort: sortParam,
      });
    },
    enabled: !!userId && userId !== -1,
  });

  const filteredTickets = useMemo(() => {
    if (!ticketListResponse?.content) return [];

    let filtered = [...ticketListResponse.content];

    if (selectedFilter === '긴급') {
      filtered = filtered.filter((ticket) => ticket.urgent);
    }

    if (selectedFilter === '검토 요청') {
      filtered = filtered.filter((ticket) => ticket.status === 'REVIEW');
    }

    return filtered;
  }, [ticketListResponse, selectedFilter]);

  const totalElements = useMemo(() => {
    if (selectedFilter === '긴급') {
      return filteredTickets.length;
    }
    return ticketListResponse?.totalElements || 0;
  }, [selectedFilter, filteredTickets, ticketListResponse?.totalElements]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedFilters]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [currentPage]);

  useEffect(() => {
    if (ticketListResponse?.totalPages && currentPage < ticketListResponse?.totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ['ticketList', apiStatus, selectedFilters, nextPage],
        queryFn: () => getTicketList({page: nextPage - 1, size: ITEMS_PER_PAGE, status: apiStatus}),
      });
    }
  }, [currentPage, queryClient, ticketListResponse?.totalPages, apiStatus, selectedFilters]);

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

  const handlePageChange = (newPage: number) => {
    if (ticketListResponse?.totalPages && newPage >= 1 && newPage <= ticketListResponse?.totalPages) {
      setCurrentPage(newPage);
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

  return (
    <div ref={listRef} className="w-full mt-[20px] relative mb-[100px]">
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
        <div className="flex items-center gap-4 leading-none mt-4 px-2">
          {dropdownData.map((data) => (
            <Dropdown
              key={data.label}
              label={data.label}
              options={data.options}
              value={
                data.label === '요청'
                  ? typeMapping[selectedFilters[data.label]] || selectedFilters[data.label]
                  : selectedFilters[data.label]
              }
              onSelect={(value) => handleSelect(data.label, value)}
              paddingX="px-3"
              disabled={data.label === '2차 카테고리' && !selectedFilters['1차 카테고리']}
            />
          ))}
          <button
            className=" text-gray-800 rounded-md  transition"
            onClick={() => {
              setSelectedFilters({});
              setCurrentPage(1);
            }}
          >
            <RefreshIcon />
          </button>
          <div className="ml-auto text-gray-700 text-subtitle">
            조회 건수 <span className="text-black text-title-bold ml-1">{totalElements}건</span>
          </div>
        </div>

        <div className="flex gap-4 py-2 text-gray-700 text-title-regular mt-5 mb-5 px-2">
          <div className="w-[6%]">티켓 ID</div>
          <div className="w-[18%]">카테고리</div>
          <div className="w-[40%]">요청 내용</div>
          <div className="w-[18%]">생성 / 마감 기한</div>
          <div className="w-[18%]">담당자</div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket: any) => (
              <UserTicket key={ticket.ticketId} {...ticket} detailLink={getDetailLink(ticket.ticketId)} />
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">{ERROR_MESSAGES.NO_TICKET}</div>
          )}
        </div>

        {filteredTickets.length > 0 && (
          <PageNations currentPage={currentPage} totalPages={ticketListResponse?.totalPages} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
