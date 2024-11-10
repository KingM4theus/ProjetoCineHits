document.addEventListener("DOMContentLoaded", function() {
    // Parte dos comentários e emojis
    const commentForm = document.getElementById("commentForm");
    const commentText = document.getElementById("commentText");
    const commentsList = document.getElementById("commentsList");
    let selectedEmoji = "";
    const username = localStorage.getItem('username') || "Usuário";
    const filmeId = document.body.getAttribute("data-movie-id"); // Obtém o ID do filme da página atual

    function addComment(text, emoji) {
        const newComment = document.createElement("p");
        newComment.innerHTML = `<strong>${username}:</strong> ${emoji} ${text}`;
        newComment.classList.add("comment-item");
        commentsList.appendChild(newComment);

        // Enviar comentário para o backend
        fetch('http://localhost:3000/comentario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: 1, filme_id: filmeId, comentario: `${username}: ${emoji} ${text}` }) // Inclui o nome de usuário no comentário
        })
        .then(response => response.json())
        .then(data => console.log(data));
    }

    function loadComments() {
        fetch(`http://localhost:3000/comentarios/${filmeId}`)
            .then(response => response.json())
            .then(data => {
                commentsList.innerHTML = ''; // Limpa a lista de comentários
                data.forEach(comment => {
                    const commentElement = document.createElement("p");
                    commentElement.innerHTML = `<strong>${comment.nome_usuario}:</strong> ${comment.comentario}`;
                    commentElement.classList.add("comment-item");
                    commentsList.appendChild(commentElement);
                });
            });
    }

    document.querySelectorAll('.emoji').forEach(item => {
        item.addEventListener('click', event => {
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.classList.remove('selected-emoji');
            });
            item.classList.add('selected-emoji');
            selectedEmoji = item.getAttribute('data-emoji');
        });
    });

    commentForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const comment = commentText.value.trim();
        if (comment) {
            addComment(comment, selectedEmoji);
            commentText.value = "";
            selectedEmoji = "";
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.classList.remove('selected-emoji');
            });
        }
    });

    // Parte das recomendações de filmes
    const apiKey = "46a549b375f4e9cdeca63794a968df8d"; // Sua chave API
    const recommendationsContainer = document.getElementById("recommendations");

    async function getRecommendations(movieId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=pt-BR`);
            const data = await response.json();
            displayRecommendations(data.results);
        } catch (error) {
            console.error("Erro ao buscar recomendações: ", error);
        }
    }

    function displayRecommendations(movies) {
        recommendationsContainer.innerHTML = ""; // Remove o conteúdo anterior
        const title = document.createElement("h2");
        title.textContent = "Recomendações";
        recommendationsContainer.appendChild(title); // Adiciona o título ao container

        // Embaralha os filmes e seleciona os primeiros 3
        movies = movies.sort(() => 0.5 - Math.random()).slice(0, 3);

        movies.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("movie-recommendation");
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
            `;
            recommendationsContainer.appendChild(movieElement);
        });
    }

    // Chamar getRecommendations e loadComments com o ID do filme específico
    getRecommendations(filmeId);
    loadComments();

    // Parte da barra de pesquisa
    const searchBar = document.querySelector('.search-bar');
    const movieItems = document.querySelectorAll('.movie-item');

    searchBar.addEventListener('input', function() {
        const searchText = searchBar.value.toLowerCase();
        movieItems.forEach(movie => {
            const movieTitle = movie.querySelector('.movie-title').textContent.toLowerCase();
            if (movieTitle.includes(searchText)) {
                movie.style.display = 'block';
            } else {
                movie.style.display = 'none';
            }
        });
    });
});


















