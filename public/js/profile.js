// variables
const review = document.querySelector('#writeReview');
const currentReview = document.querySelector('#current-review');

// this function is creating elements to allow the user to create a review 
function writeReview() {
    if (currentReview.firstChild) {
        currentReview.firstChild.remove();
    }
    var h2 = document.createElement('h2');
    h2.textContent = "Write your review here!!";
    currentReview.append(h2);
    var textarea = document.createElement('textarea');
    currentReview.append(textarea);
    var button = document.createElement('button');
    button.textContent = "Submit";
    currentReview.append(button);

};
// I need to add classes to these created elements and call the write Review function to get it to display when clicked 

review.addEventListener("click", writeReview);


