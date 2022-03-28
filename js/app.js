const searchInputEl = document.querySelector('.l-search__input')
const searchButtonEl = document.querySelector('.l-search__button')
const mainContainerEl = document.querySelector('.l-main')
const paginationContainerEl = document.querySelector('.l-pagination')

const api = 'https://api.lyrics.ovh'

/* 
    para usar o cors anywhere do heroku
    antes é necessário acessar esse link e clicar no botão
    "Request temporary access to the demo server"
    https://cors-anywhere.herokuapp.com/corsdemo
 */

const formatInputValue = value => {
    const formatedValue =
        value
        .toLowerCase()
        .replace(/[áàâãä]/gmi, 'a')
        .replace(/[éèêë]/gmi, 'e')
        .replace(/[íìîï]/gmi, 'i')
        .replace(/[óòôõö]/gmi, 'o')
        .replace(/[úùûü]/gmi, 'u')
        .replace(/ç/gmi, 'c')
        .replace(/ñ/gmi, 'n')
        .replace(/["'!@#$£%¢¨¬&*()_\-+=§`´^~<>,.;:{}\[\]ªº?|\\\/]/gm, '')
        .replace('   ', ' ')
        .replace('  ', ' ')
    return formatedValue
}

const clearMainContainer = () => {
    mainContainerEl.innerHTML = ''
    paginationContainerEl.classList.remove('is-active')
}

const showSearchError = searchTerme => {
    clearMainContainer()
    const errorContainer = document.createElement('div')
    errorContainer.classList.add('c-error-message')
    errorContainer.innerHTML = `
        <p class="c-error-message__text">
            Nenhuma ocorrência de <span class="c-error-message__search">"${searchTerme}"</span> foi encontrada.
        </p>
    `
    mainContainerEl.appendChild(errorContainer)
}

const showNotFoundError = (artist, title) => {
    clearMainContainer()
    const errorContainer = document.createElement('div')
    errorContainer.classList.add('c-error-message')
    errorContainer.innerHTML = `
        <p class="c-error-message__text">
            Desculpe, mas não possuímo a letra <span class="c-error-message__search">"${title}"</span> de <span class="c-error-message__search">"${artist}"</span> em nosso banco de dados.
        </p>
    `
    mainContainerEl.appendChild(errorContainer)
}

const getHTMLSongs = songs => {
    const HTMLList = songs.map(song => {
        return `
            <li class="c-music-list__item">
                <p class="c-music-list__info">
                    <span class="c-music-list__music-autor">${song.artist.name}</span> - ${song.title}
                </p>
                <button class="c-music-button u-animated-gradient" data-artist="${song.artist.name}" data-title="${song.title}" data-album="${song.album.title}" data-cover="${song.album['cover_big']}">
                    ver letra
                </button>
            </li>
        `
    })
    return HTMLList
}

const insertSongsIntoDOM = songs => {
    clearMainContainer()
    const songsContainer = document.createElement('ul')
    songsContainer.setAttribute('class', 'c-music-list is-active')
    songsContainer.innerHTML = songs.join()
    mainContainerEl.appendChild(songsContainer)
}

const paginationHandle = (prev, next) => {
    const prevButton = paginationContainerEl.querySelector('[data-js="prev"]')
    const nextButton = paginationContainerEl.querySelector('[data-js="next"]')
    prevButton.classList.remove('is-active')
    nextButton.classList.remove('is-active')
    if (prev || next) {
        paginationContainerEl.classList.add('is-active')
        if (prev) {
            prevButton.dataset.prev = prev
            prevButton.classList.add('is-active')
        }
        if (next) {
            nextButton.dataset.next = next
            nextButton.classList.add('is-active')
        }
    }
}

const hideSongListAndPagination = () => {
    const songsContainerEl = document.querySelector('.c-music-list')
    songsContainerEl.classList.remove('is-active')
    paginationContainerEl.classList.remove('is-active')
}

const showSongListAndPagination = () => {
    const lyricContainer = document.querySelector('.c-music-box')
    mainContainerEl.removeChild(lyricContainer)
    const songsContainer = document.querySelector('.c-music-list')
    songsContainer.classList.add('is-active')
    paginationContainerEl.classList.add('is-active')
}

const formatLyric = lyric => {
    const formatedLyric = lyric.replace(/(\r\n|\r|\n)/gmi, '<br>')
    return formatedLyric
}

const createLyricContainer = (artist, title, album, cover, lyrics) => {
    const lyricContainer = document.createElement('div')
    lyricContainer.classList.add('c-music-box')

    const lyricInfo = document.createElement('div')
    lyricInfo.classList.add('c-music-box__info')
    lyricInfo.innerHTML = `
        <h2 class="c-music-box__title">${title}</h2>
        <h3 class="c-music-box__autor">${artist}</h3>
        <img class="c-music-box__album-cover" src="${cover}" alt="${artist} - ${title}">
        <p class="c-music-box__album-description">Album:</p>
        <h4 class="c-music-box__album-name">${album}</h4>
    `
    const backButton = document.createElement('a')
    backButton.classList.add('c-music-box__return')
    backButton.innerHTML = '&lt;&lt; voltar'
    backButton.addEventListener('click', showSongListAndPagination)
    lyricInfo.appendChild(backButton)

    lyricContainer.appendChild(lyricInfo)
    

    const lyric = document.createElement('div')
    lyric.classList.add('c-music-box__lyric')
    lyric.innerHTML = formatLyric(lyrics)

    lyricContainer.appendChild(lyric)

    return lyricContainer
}

const showLyric = (artist, title, album, cover, lyrics) => {
    const lyricElement = createLyricContainer(artist, title, album, cover, lyrics)
    hideSongListAndPagination()
    mainContainerEl.appendChild(lyricElement)
}

const fetchSongList = async searchTerme => {
    const songsUrl = `${api}/suggest/${formatInputValue(searchTerme)}`
    const response = await fetch(songsUrl)
    const list = await response.json()
    if (list.data.length < 1) {
        showSearchError(searchTerme)
        return
    }
    insertSongsIntoDOM(getHTMLSongs(list.data))
    paginationHandle(list.prev, list.next)
    console.log(list.data[0])
}

const loadMoreSongs = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const list = await response.json()
    console.log(list)
    insertSongsIntoDOM(getHTMLSongs(list.data))
    paginationHandle(list.prev, list.next)
}

const fetchLyric = async (artist, title, album, cover) => {
    const lyricUrl = `${api}/v1/${artist}/${title}`
    const reponse = await fetch(lyricUrl)
    const data = await reponse.json()
    if (data.error) {
        showNotFoundError(artist, title)
        return
    }
    console.log(data);
    showLyric(artist, title, album, cover, data.lyrics)
}

const searchInputHandle = () => {
    const inputValue = searchInputEl.value
    if (inputValue !== '') {
        fetchSongList(inputValue)
    }
}

searchButtonEl.addEventListener('click', searchInputHandle)

document.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        searchInputHandle()
    }
})

paginationContainerEl.addEventListener('click', event => {
    const elementDataset = event.target.dataset
    if (elementDataset.js) {
        if (elementDataset.prev) {
            loadMoreSongs(elementDataset.prev)
            return
        }
        if (elementDataset.next) {
            loadMoreSongs(elementDataset.next)
            return
        }
    }
})

mainContainerEl.addEventListener('click', event => {
    const target = event.target
    if (target.classList.contains('c-music-button')) {
        const {title, artist, album, cover} = target.dataset
        hideSongListAndPagination()
        fetchLyric(artist, title, album, cover)
    }
})