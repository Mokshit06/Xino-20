const stars = rating => {
  rating = parseFloat(rating);
  let numberOfStars = Math.round(rating);
  const emptyStars = 5 - numberOfStars;
  let html = '';
  for (let i = 0; i < numberOfStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }
  return html;
};

// console.log(stars(1))
module.exports = {
  stars,
};
