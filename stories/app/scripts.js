const stories = document.querySelector(".stories");
const median = stories.offsetLeft + stories.clientWidth / 2;

const state = {
    current_story: stories.firstElementChild.lastElementChild
}

function navigateStories(direction) {
    const story = state.current_story;
    const lastItemInUserStory = story.parentElement.firstElementChild;
    const firstItemInUserStory = story.parentElement.lastElementChild;
    const hasNextUserStory = story.parentElement.nextElementSibling;
    const hasPreUserStory = story.parentElement.previousElementSibling;
    
    if(direction === 'next') {
        if(lastItemInUserStory === story && !hasNextUserStory) return;
        else if(lastItemInUserStory === story && hasNextUserStory) {
            // lastItemInUserStory === stories 其实上面这个式子和这个式子是等价的，上面好懂一些
            
            state.current_story = story.parentElement.nextElementSibling.lastElementChild;
            state.current_story.scrollIntoView({
                behavior: "smooth"
            });
        }else{
            // 当前的透明，露出下面的
            story.classList.add("seen");
            state.current_story = story.previousElementSibling;
        }
    }else if(direction === 'prev') {
        if(firstItemInUserStory === story && !hasPreUserStory) return;
        else if(firstItemInUserStory === story && hasPreUserStory) {
            state.current_story = story.parentElement.previousElementSibling.firstElementChild;
            state.current_story.scrollIntoView({
                behavior: "smooth"
            });
        }else {
            story.nextElementSibling.classList.remove("seen");
            state.current_story = story.nextElementSibling;
        }
    }
}

stories.addEventListener('click', (event) => {
    navigateStories(
        event.clientX > median ? 'next' : 'prev'
    )
});


