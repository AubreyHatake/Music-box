// variables
const review = document.querySelector('#writeReview');
const currentReview = document.querySelector('#current-review');

// this function is creating elements to allow the user to create a review 
function writeReview() {
    if (currentReview.firstElementChild) {
        currentReview.firstElementChild.remove();
    }

    var h2 = document.createElement('h2');
    h2.textContent = "Write your review here!!";
    currentReview.append(h2);
    var input = document.createElement('input');
    currentReview.append(input);
    var button = document.createElement('button');
    button.textContent = "Submit";
    currentReview.append(button);


};


review.addEventListener("click", writeReview);


