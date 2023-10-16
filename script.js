function makeX (x)  {
    x.classList.toggle("change");
};


//NEXT AND PREV BUTTON FOR ARTICLES SECTION
document.getElementById('next').onclick = function(){
    let lists = document.querySelectorAll('.article__item');
    document.getElementById('article__slide').appendChild(lists[0]);
  }
  document.getElementById('prev').onclick = function(){
    let lists = document.querySelectorAll('.article__item');
    document.getElementById('article__slide').prepend(lists[lists.length - 1]);
  }
  
  //SEE MORE BUTTON FOR ARTICLES SECTION
  let articleItemButtons = document.querySelectorAll('.article__item button');
  articleItemButtons.forEach(function (button) {
    button.onclick = function () {
      alert('Button Clicked!');
    };
  });