const Timeline = ({ events }: any) => (
  <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-gray-200">
    {events
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .map((event: any, idx: any) => (
        <div key={idx} className="relative mb-6 last:mb-0">
          <div className="absolute -left-8 top-0.5 w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10"></div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between flex-wrap gap-2 mb-2">
              <span className="font-medium text-gray-900">{event.status}</span>
              <span className="text-sm text-gray-500">
                {new Date(event.timestamp).toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-gray-700">
              {event.note || 'No additional notes'}
            </p>
          </div>
        </div>
      ))}
  </div>
);

export default Timeline;
