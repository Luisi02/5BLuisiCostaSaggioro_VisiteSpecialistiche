const createMiddleware = () => {
    return {
      load: async () => {
        const response = await fetch("/booking");
        const json = await response.json();
        return json;
      },
      add: async (booking) => {
        const response = await fetch("/insert", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                accident: accident
            })
        });
        const json = await response.json();
        return json;        
      }
    }
  }

  export default createMiddleware;