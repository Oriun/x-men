declare namespace Xmen {
    type Prepare = {
        strings: string[],
        text: string
    };
    type Element = {
      $tagName: string;
      $attributes: {
        [key: string]: string;
      };
      $children: Element[]
      [key: string]: any
    }
    var prepare: (data: string) => Prepare;
    class xml {
      root: Element;
      text: string;
      CDATA: string[];
      strings: string[];
      originalData: string;
      constructor(data: string);
    }
  }
  export default Xmen;
  