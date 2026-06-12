import { Link } from 'react-router-dom';

type TopBarProps = {
  title: string;
  onTitleChange: (title: string) => void;
};

export default function TopBar({ title, onTitleChange }: TopBarProps) {
  return (
    <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-gray-300">
      <div className="flex items-center gap-4">
        {/* Logo acting as Home Button */}
        <Link to="/documents" className="text-blue-600 font-bold text-3xl pb-1 hover:opacity-80">
          🐼
        </Link>
        
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-medium text-gray-800 text-lg hover:border-gray-300 border border-transparent rounded px-1 -ml-1 outline-none focus:border-blue-500 bg-transparent"
          />
          <div className="flex gap-3 text-sm text-gray-500 mt-0.5 -ml-1">
            <button className="hover:bg-gray-100 px-1.5 rounded cursor-pointer">File</button>
            <button className="hover:bg-gray-100 px-1.5 rounded cursor-pointer">Edit</button>
            <button className="hover:bg-gray-100 px-1.5 rounded cursor-pointer">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}