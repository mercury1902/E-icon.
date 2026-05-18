import { useApp } from '../../context/AppContext';

function TopicFilter({ selected, onSelect }) {
  const { topics } = useApp();

  return (
    <div className="topic-filter">
      <button
        className={`topic-chip ${!selected ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {topics.map((tpc) => (
        <button
          key={tpc.id}
          className={`topic-chip ${selected === tpc.id ? 'active' : ''}`}
          style={{ '--topic-color': tpc.color }}
          onClick={() => onSelect(tpc.id)}
        >
          {tpc.name}
        </button>
      ))}
    </div>
  );
}

export default TopicFilter;
