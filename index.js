const leftContainer = document.querySelector("#leftSideContainer");
const bigPictureContainer = document.querySelector("#bigPictureContainer")
const greyscaleFilter = document.querySelector("#greyscaleFilter");
const blurFilter = document.querySelector("#blurRange");

let blurValue = blurFilter.value;
let greyscaleValue = "";
let page = 1;
let nextPage = true;

const fetchData = async (page) => {
  if (nextPage) {
    const response = await axios.get(
      `https://picsum.photos/v2/list?page=${page}`
    );
    nextPage = response.headers.link.includes("next");
    return response.data;
  } else if (response.data.Error || (!nextPage)) {
    return [];
  }
};

const HandleGreyscaleValueChange = (event) => {
  if (event.target.checked) greyscaleValue = "grayscale";
  else greyscaleValue = "";
};

const handleBlurValueChange = (event) => {
  blurValue = event.target.value;
};

greyscaleFilter.addEventListener("change", HandleGreyscaleValueChange);
blurFilter.addEventListener("change", handleBlurValueChange);

const getPictures = async (page) => {
  const pictures = await fetchData(page);

  for (let picture of pictures) {
    const pictureElementSmall = document.createElement("div");
    const pictureUrlSmall = picture.download_url.substring(
      0,
      picture.download_url.length - 10
    );
    pictureElementSmall.innerHTML = `<img class="leftSidePic" src="${pictureUrlSmall}/200"> `;
    leftContainer.appendChild(pictureElementSmall);

    pictureElementSmall.addEventListener("click", () => {
      const bigPicture = document.querySelector(".bigPictureElement");
      if (bigPicture !== null) bigPicture.remove();
      onPictureSelect(picture);
    });
  }
};

const onPictureSelect = async (picture) => {
  const bigPictureElement = document.createElement("div");
  bigPictureElement.setAttribute("class", "bigPictureElement");
  bigPictureElement.innerHTML = `<p>Author: ${picture.author}. Size: ${picture.width}px <b>x</b> ${picture.height}px</p> <div class="pictureWrap"><img class="bigPicture" alt="image" src="${picture.download_url}?${greyscaleValue}&blur=${blurValue}"></div> `;
  bigPictureContainer.appendChild(bigPictureElement);
};

leftContainer.addEventListener("scroll", () => {
  const { scrollHeight, scrollTop, clientHeight } = leftContainer;
  if (scrollTop + clientHeight > scrollHeight - 1) {
    page = page++;
    getPictures(page);
  }
});

bigPictureContainer.addEventListener('contextmenu', event => event.preventDefault());

getPictures(page);
