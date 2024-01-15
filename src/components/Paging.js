import React, { useState } from 'react';

// From ChatGPT4
const PagingComponent = ({ count, perPage, renderChild }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(count / perPage);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderItems = () => {
    const items = [];
    for (let i = 0; i < currentPage * perPage && i < count; i++) {
      items.push(renderChild(i));
    }
    return items;
  };

  return (
    <div>
      {renderItems()}
      {currentPage < totalPages && (
        <button onClick={loadMore} className="load-more">Load More</button>
      )}
    </div>
  );
};

export default PagingComponent;

