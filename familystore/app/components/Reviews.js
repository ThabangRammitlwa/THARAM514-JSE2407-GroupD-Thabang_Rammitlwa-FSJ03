/**
 * Reviews component to display customer reviews with a rating and comment.
 *
 * @param {Object} props - The properties passed to the Reviews component.
 * @param {Array} props.reviews - An array of review objects.
 * @param {string} props.reviews[].reviewerName - The name of the reviewer.
 * @param {string} props.reviews[].date - The date when the review was posted.
 * @param {number} props.reviews[].rating - The rating given by the reviewer (from 1 to 5).
 * @param {string} props.reviews[].comment - The review comment text.
 * @returns {JSX.Element} - A component that renders a list of customer reviews.
 */
export default function Reviews({ reviews }) {
    const renderStars = (rating) => {
      return (
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
        </div>
      );
    };
  
    return (
      <div className="space-y-8">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <span className="font-semibold text-lg text-amber-700 mb-2 sm:mb-0">{review.reviewerName}</span>
              <span className="text-sm text-amber-600">{new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mb-4">
              {renderStars(review.rating)}
              <span className="ml-2 text-amber-700 font-semibold">{review.rating} / 5</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    );
  }