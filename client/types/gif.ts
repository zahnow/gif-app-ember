type Gif = {
  id: string;
  title: string;
  url: string;
  images: {
    original: {
      url: string;
      height: number;
      width: number;
    };
  };
};

export default Gif;
