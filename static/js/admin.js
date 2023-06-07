let postInfo = {
    title: '',
    description: '',
    authorName: '',
    authorPhoto: '',
    date: '',
    heroImg: '',
    content: '',
}

const cameraPath = '/static/img/camera.svg'

document.getElementById('publish').onclick = () => {
    hiddeErrors()
    hiddeSuccess()
    let jsonPostInfo = JSON.stringify(postInfo);
    let errors = validateForm(postInfo)
    if (errors.error) {
        sendErrors(errors)
    } else {
        setSuccessMessage()
        console.log(postInfo);
        let XHR = new XMLHttpRequest();
        XHR.open('POST', '/api/post');
        XHR.send(jsonPostInfo);
        setSuccessMessage()
    }
}

document.getElementById('logout').onclick = () => {
    let XHR = new XMLHttpRequest();
    XHR.onreadystatechange = () => {
        if (XHR.readyState == 4) {
            if (XHR.status == 200){
                window.location.href = '/index'
            }
        }
    };
    XHR.open('POST', '/api/logout');
    XHR.send();
}

function hiddeSuccess(){
    let messageBoxSuccess = document.getElementById('message-box-success')
    messageBoxSuccess.classList.add('hidden')
    messageBoxSuccess.classList.remove('message-box-animation')
}

function hiddeErrors(){
    let messageBoxError = document.getElementById('message-box')
    let commentTitle = document.getElementById('comment-title')
    let commentDescription = document.getElementById('comment-description')
    let commentAuthorName = document.getElementById('comment-author-name')
    let commentAuthorPhoto = document.getElementById('comment-author-photo')
    let commentDate = document.getElementById('comment-date')
    let commentImgHeroBig = document.getElementById('comment-img-hero-big')
    let commentImgHeroSmall = document.getElementById('comment-img-hero-small')
    let commentContent = document.getElementById('comment-content')
    unsetErrorComment(commentTitle)
    unsetRedUnderline(document.getElementById('input-title'))
    unsetErrorComment(commentDescription)
    unsetRedUnderline(document.getElementById('input-descpription'))
    unsetErrorComment(commentAuthorName)
    unsetRedUnderline(document.getElementById('input-name'))
    unsetErrorComment(commentAuthorPhoto)
    unsetErrorComment(commentDate)
    unsetRedUnderline(document.getElementById('input-date'))
    unsetErrorComment(commentImgHeroBig)
    unsetErrorComment(commentImgHeroSmall)
    unsetErrorComment(commentContent)
    messageBoxError.classList.add('hidden')
    messageBoxError.classList.remove('message-box-animation')
}

function setSuccessMessage(){
    let messageBoxSuccess = document.getElementById('message-box-success')
    messageBoxSuccess.classList.remove('hidden')
    messageBoxSuccess.classList.add('message-box-animation')
}

function sendErrors(errors){
    let messageBoxError = document.getElementById('message-box')
    let commentTitle = document.getElementById('comment-title')
    let commentDescription = document.getElementById('comment-description')
    let commentAuthorName = document.getElementById('comment-author-name')
    let commentAuthorPhoto = document.getElementById('comment-author-photo')
    let commentDate = document.getElementById('comment-date')
    let commentImgHeroBig = document.getElementById('comment-img-hero-big')
    let commentImgHeroSmall = document.getElementById('comment-img-hero-small')
    let commentContent = document.getElementById('comment-content')
    
    if (errors.message){
        messageBoxError.classList.remove('hidden')
        messageBoxError.classList.add('message-box-animation')
    }
    if (errors.titleError){
        setErrorComment(commentTitle, errors.titleError)
        setRedUnderline(document.getElementById('input-title'))
    }
    if (errors.descriptionError){
        setErrorComment(commentDescription, errors.descriptionError)
        setRedUnderline(document.getElementById('input-descpription'))
    }
    if (errors.authorNameError){
        setErrorComment(commentAuthorName, errors.authorNameError)
        setRedUnderline(document.getElementById('input-name'))
    }
    if (errors.authorPhotoError){
        setErrorComment(commentAuthorPhoto, errors.authorPhotoError)
    }
    if (errors.dateError){
        setErrorComment(commentDate, errors.dateError)
        setRedUnderline(document.getElementById('input-date'))
    }
    if (errors.heroImgError){
        setErrorComment(commentImgHeroBig, errors.heroImgError)
        setErrorComment(commentImgHeroSmall, errors.heroImgError)
    }
    if (errors.contentError){
        setErrorComment(commentContent, errors.contentError)
    }
}

function setErrorComment(elementComment, error){
    elementComment.classList.remove('hidden')
    elementComment.classList.add('comment_red')
    elementComment.innerHTML = error
}

function unsetErrorComment(elementComment){
    elementComment.classList.add('hidden')
    elementComment.classList.remove('comment_red')
}

function unsetRedUnderline(elementInput){
    elementInput.classList.remove('field__input_red_underline')
}

function setRedUnderline(elementInput){
    elementInput.classList.add('field__input_red_underline')
}

function validateForm(postInfo) {
    let findedError = false
    let messageBoxError = ''
    let titleError = ''
    let descriptionError = ''
    let authorNameError = ''
    let authorPhotoError = ''
    let dateError = ''
    let heroImgError = ''
    let contentError = ''
    if (postInfo.title == ''){
        findedError = true
        titleError = 'Title is required.'
    }
    if (postInfo.description == ''){
        findedError = true
        descriptionError = 'Title is required.'
    }
    if (postInfo.authorName == ''){
        findedError = true
        authorNameError = 'Author name is required.'
    }
    if (postInfo.authorPhoto == ''){
        findedError = true
        authorPhotoError = 'Author photo is required.'
    }
    if (postInfo.date == ''){
        findedError = true
        dateError = 'Date is required.'
    }
    if (postInfo.heroImg == ''){
        findedError = true
        heroImgError = 'Hero img is required.'
    }
    if (postInfo.content == ''){
        findedError = true
        contentError = 'Content is required.'
    }

    if (findedError == true){
        messageBoxError = 'Whoops! Some fields need your attention :o'
    }

    return {
        'error': findedError,
        'message': messageBoxError,
        'titleError': titleError,
        'descriptionError': descriptionError,
        'authorNameError': authorNameError,
        'authorPhotoError': authorPhotoError,
        'dateError': dateError,
        'heroImgError': heroImgError,
        'contentError': contentError,
    }
}

document.getElementById('input-title').onchange = () => {
    postInfo.title = document.getElementById('input-title').value;
    document.getElementById('box-title').innerText = postInfo.title;
    document.getElementById('box-title-card').innerText = postInfo.title;
}

document.getElementById('input-descpription').onchange = () => {
    postInfo.description = document.getElementById('input-descpription').value;
    document.getElementById('box-description-card').innerText = postInfo.description;
}

document.getElementById('input-name').onchange = () => {
    postInfo.authorName = document.getElementById('input-name').value;  
    document.getElementById('box-author-name-card').innerText = postInfo.authorName;
}

document.getElementById('input-date').onchange = () => {
    postInfo.date = document.getElementById('input-date').value;
    document.getElementById('box-date-card').innerText = createNormalDate(postInfo.date)
}

document.getElementById('content').onchange = () => {
    postInfo.content = document.getElementById('content').value;
}

document.getElementById('author-photo-input').onchange = () => {
    let authorPhoto = document.getElementById('author-photo-input');
    const file = authorPhoto.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        postInfo.authorPhoto = reader.result;
        document.getElementById('box-author-img-card').src = reader.result;
        document.getElementById('author-photo').src = reader.result;
        document.getElementById('upload-text-author-photo').classList.add('hidden')
        document.getElementById('upload-author-photo').classList.remove('hidden')
        document.getElementById('upload-author-photo').classList.add('upload')
        document.getElementById('remove-author-photo').classList.remove('hidden')
        document.getElementById('remove-author-photo').classList.add('remove')
    }
}

document.getElementById('card-photo-input-big').onchange = () => {
    let cardPhotoInput = document.getElementById('card-photo-input-big')
    hideUploadTextInCard();
    const file = cardPhotoInput.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        postInfo.heroImg = reader.result;
        setAllPhotoSectors(reader.result);

        viewControllersCardPhoto();
    }
}

document.getElementById('card-photo-input-small').onchange = () => {
    let cardPhotoInput = document.getElementById('card-photo-input-small');
    hideUploadTextInCard();
    const file = cardPhotoInput.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        postInfo.heroImg = reader.result;
        setAllPhotoSectors(reader.result);

        viewControllersCardPhoto();
    }
}

function hideUploadTextInCard(){
    for (element of document.getElementsByClassName('form__hero-img')) {
        element.style.display = 'none';
    }
    let isHeroImg = false;
    for (element of document.getElementsByClassName('photo-upload')) {
        if (isHeroImg){
            element.style.display = 'none';
        }
        isHeroImg = true;
    }
}

document.getElementById('upload-author-photo').onclick = () => {
    let authorPhoto = document.getElementById('author-photo-input');
    const file = authorPhoto.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        postInfo.authorPhoto = reader.result;
        document.getElementById('box-author-img-card').src = reader.result;

        authorPhoto.src = reader.result;
    }
}

document.getElementById('remove-author-photo').onclick = () => {
    postInfo.authorPhoto = '';
    document.getElementById('box-author-img-card').src = '/static/img/author-photo.png';
    document.getElementById('author-photo').src = '/static/img/author-photo.png';
}

document.getElementById('remove-hero-image').onclick = () => {
    postInfo.heroImg = '';
    setAllPhotoSectors('');
    document.getElementById('card-photo-big').style.backgroundImage = '';
    hiddenControllersCardPhoto();
}

document.getElementById('remove-hero-image-small').onclick = () => {
    postInfo.heroImg = '';
    setAllPhotoSectors('');
    hiddenControllersCardPhoto();
}

function viewControllersCardPhoto(){
    document.getElementById('comment1').classList.add('hidden')
    document.getElementById('comment2').classList.add('hidden')
    document.getElementById('upload-hero-image').classList.remove('hidden')
    document.getElementById('upload-hero-image').classList.add('upload')
    document.getElementById('upload-hero-image-small').classList.remove('hidden')
    document.getElementById('upload-hero-image-small').classList.add('upload')
    document.getElementById('remove-hero-image').classList.remove('hidden')
    document.getElementById('remove-hero-image').classList.add('remove')
    document.getElementById('remove-hero-image-small').classList.remove('hidden')
    document.getElementById('remove-hero-image-small').classList.add('remove')
}

function hiddenControllersCardPhoto(){
    document.getElementById('comment1').classList.remove('hidden')
    document.getElementById('comment2').classList.remove('hidden')
    document.getElementById('upload-hero-image').classList.add('hidden')
    document.getElementById('upload-hero-image').classList.remove('upload')
    document.getElementById('upload-hero-image-small').classList.add('hidden')
    document.getElementById('upload-hero-image-small').classList.remove('upload')
    document.getElementById('remove-hero-image').classList.add('hidden')
    document.getElementById('remove-hero-image').classList.remove('remove')
    document.getElementById('remove-hero-image-small').classList.add('hidden')
    document.getElementById('remove-hero-image-small').classList.remove('remove')
    for (element of document.getElementsByClassName('form__hero-img')){
        element.style.display = "block"
    }
    let isHeroImg = false;
    for (element of document.getElementsByClassName('photo-upload')){
        if (isHeroImg){
            element.style.display = "block"
        }
        isHeroImg = true;
    }
}

function setAllPhotoSectors(base64) {
    document.getElementById('card-photo-big').style.backgroundImage = createUrlFromBase64(base64);
    document.getElementById('card-photo-small').style.backgroundImage = createUrlFromBase64(base64);
    document.getElementById('box-image').style.backgroundImage = createUrlFromBase64(base64);
    document.getElementById('box-image-card').style.backgroundImage = createUrlFromBase64(base64);
}

function createUrlFromBase64(base64) {
    return 'url(' + base64 + ')'
}

function createNormalDate(date) {
    return date
    let dateInfo = date.split('-');
    let year = dateInfo[0];
    let mounth = dateInfo[1];
    let day = dateInfo[2];
    return day + '/' + mounth + '/' + year;
}