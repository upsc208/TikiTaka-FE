import TopMenu from '../common/TopMenu';

export default function UserHomeContainer() {
  return (
    <div className="top-container">
      <div className="flex flex-col max-w-1200">
        <TopMenu boldBlackText="Dashboard" boldGrayText="요청 티켓 관리 대시보드" rightText="티켓 생성 바로가기" linkTo="/user/newticket" />
      </div>
    </div>
  );
}
