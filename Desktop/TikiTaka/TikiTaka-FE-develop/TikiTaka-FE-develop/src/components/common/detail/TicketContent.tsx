import MarkdownPreview from '../MarkdownPreview';

interface TicketContentProps {
  data: TicketDetails;
}

export default function TicketContent({data}: TicketContentProps) {
  return (
    <div className="relative">
      <div className="flex justify-end gap-2 text-body-regular"></div>
      <div className="w-full h-[400px] overflow-scroll p-5 border border-gray-2 rounded-[4px] bg-white text-subtitle-regular text-gray-15">
        <MarkdownPreview content={data?.description || ''} />
      </div>
    </div>
  );
}
