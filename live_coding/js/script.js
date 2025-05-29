function initGetPosts() {
    const posts = document.querySelector('#posts');
    console.log(posts);
    // fetch('http://localhost/home/')
    fetch('https://dummyjson.com/posts?limit=5')
        .then(res => res.json())
        .then(res => {
            res.posts.forEach(post => {
                renderPost({
                    title: post.title,
                    body: post.body,
                    likeCounter: post.reactions.likes
                })
            })
        });
}

/**
 * @param {string} title 
 * @param {string} description 
 */
async function addPost(title, description) {
    const res = await fetch('https://dummyjson.com/posts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                body: description,
                userId: 1
            }),
    });
    const post = await res.json();
    renderPost({
        title: post.title,
        body: post.body,
        likeCounter: 0
    });
}

/**
 * @param {{
 *  title: string,
 *  body: string,
 *  likeCounter: number
 * }} post
 */
function renderPost(post) {
    const posts = document.querySelector('#posts');
    const postBlock = document.createElement('div');
    postBlock.classList.add('post');

    const postTitle = document.createElement('h2');
    postTitle.textContent = post.title;
    postBlock.appendChild(postTitle);

    const description = document.createElement('p');
    description.textContent = post.body;
    postBlock.appendChild(description)

    const postLikeButton = document.createElement('button');
    postLikeButton.textContent = post.likeCounter;
    postLikeButton.addEventListener('click', event => {
        const likes = parseInt(event.target.innerText);
        const newLikes = likes + 1;
        event.target.innerText = newLikes;
    });
    postBlock.appendChild(postLikeButton);

    posts.appendChild(postBlock);
}

function initAddPost() {
    const addPostButton = document.querySelector('#addPostButton');
    addPostButton.addEventListener('click', () => {
        const title = document.querySelector('#postTitle');
        const description = document.querySelector('#postDescription');
        

        addPost(title.value, description.value);
    });
}

initGetPosts();
initAddPost();