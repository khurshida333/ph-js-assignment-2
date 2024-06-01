const playerContainer = document.getElementById("player-card-container");


const handleSearch = () => {
    const searchInput = document.getElementById("search-input").value;

    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchInput}`)
        .then(res => res.json())
        .then(data => {
            if (data.player) {
                displayPlayers(data.player);
            } else {
                alert("Player not found");
            }
        });
};

const displayPlayers = (players) => {
    playerContainer.innerHTML = ''; // Clear previous results

    players.forEach(player => {
        const div = document.createElement("div");
        div.classList.add("player-cards");

        div.innerHTML = `
            <img class="player-cards-img" src="${player.strThumb}" alt="${player.strPlayer}" />
            <h5>${player.strPlayer}</h5>
            <img onclick="openSocialMedia('instagram', '${player.strInstagram}')" class="player-cards-icon" src="insta-icon3.png" alt="Instagram"/>
            <img onclick="openSocialMedia('twitter', '${player.strTwitter}','${player.strPlayer}')" class="player-cards-icon" src="twitter-icon2.png" alt="Twitter"/>
            <h5>${player.strNationality}</h5>
            <h5>Team : ${player.strTeam}</h5>
            <h4>Sport : ${player.strSport}</h4>
            <h5>Salary : ${player.strWage}</h5>
            <p>${player.strDescriptionEN ? player.strDescriptionEN.slice(0, 50) : 'No description available'}.....</p>
            <button class="addBtn" onclick="handleAddToCart('${player.strPlayer}','${player.idPlayer}')">Add to group</button>
            <button class="detailsBtn" onclick="handlePlayerDetails('${player.idPlayer}')" type="button">Details</button>
        `; 

        playerContainer.appendChild(div);
    });
};

const handlePlayerDetails = (id) => {
    const modal1 = new bootstrap.Modal(document.getElementById('details'));

    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.players && data.players.length > 0) {
                const player = data.players[0];
                const modalHeader = document.getElementById("modal-header");
                const modalBody = document.getElementById("modal-body");

                modalHeader.innerHTML = `
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                `;

                modalBody.innerHTML = `
                    <h3>${player.strPlayer}</h3>
                    <p>Sport: ${player.strSport}</p>
                    <p>${player.strDescriptionEN.slice(0,1000)}</p>
                `;
                
                modal1.show();
            } else {
                alert("Player details not found");
            }
        })
        .catch(error => {
            console.error('Error fetching player details:', error);
            alert("An error occurred while fetching player details.");
        });
};


const handleclosebtn = () => {
    modal1.hide();
};

const handleAddToCart = (name, id) => {
    const cartCount = document.getElementById("count").innerText;
    let convertedCount = parseInt(cartCount);
    if (convertedCount < 7) {
        convertedCount += 1;
        document.getElementById("count").innerText = convertedCount;

        const container = document.getElementById("cart-main-container");

        const div = document.createElement("div");
        div.classList.add("cart-info");

        div.innerHTML = `
            <p>${id}</p>
            <p>${name}</p>
        `;
        container.appendChild(div);
    } else {
        alert("You can't add more than 7 people to the group");
    }
};

const openSocialMedia = (platform, handle, name) => {
    let url = '';
    switch (platform) {
        case 'instagram':
            url = `https://${handle}`;
            break;
        case 'twitter':
            url = `https://x.com/${name}/`;
            break;
        default:
            alert('Unknown platform');
            return;
    }
    window.open(url, '_blank');
};
