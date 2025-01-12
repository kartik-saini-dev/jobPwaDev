// components/News.js
const News = () => {
  const newsItems = [
    { id: 1, title: "Top companies hiring this month!", date: "October 1, 2024" },
    { id: 2, title: "How to ace your next job interview.", date: "September 30, 2024" },
    { id: 3, title: "Tech job trends to watch in 2024.", date: "September 29, 2024" },
  ];

  return (
    <div className="w-64 bg-white p-6 shadow-lg rounded-lg h-fit">
      <h2 className="text-lg font-bold mb-4 text-center">Latest Job News</h2>
      <ul className="space-y-4">
        {newsItems.map((item) => (
          <li key={item.id} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <a href="#" className="text-custom-dark-mint-green hover:text-custom-mint-green font-medium">
                {item.title}
              </a>
              <span className="text-xs text-gray-500">{item.date}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <a
          href="#"
          className="block text-center text-blue-500 hover:text-blue-700 font-semibold"
        >
          See All Job News
        </a>
      </div>
    </div>
  );
};

export default News;
