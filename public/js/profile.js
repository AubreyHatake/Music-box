const newFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#review-name').value.trim();
    const review_rating = document.querySelector('#review-rating').value.trim();
    const description = document.querySelector('#review-desc').value.trim();
  
    if (name && review_rating  && description) {
      const response = await fetch(`/profile`, {
        method: 'POST',
        body: JSON.stringify({ name, review_rating , description }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to create review');
      }
    }
  };
  
  const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to delete review');
      }
    }
  };
  
  document
    .querySelector('.new-review-form')
    .addEventListener('submit', newFormHandler);
  
  document
    .querySelector('.review-list')
    .addEventListener('click', delButtonHandler);
  


