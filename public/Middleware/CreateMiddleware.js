export const createMiddleware = () => {
    return {
        load: async () => {
            const response = await fetch("/booking");
            return await response.json();
        },
        delete: async (id) => {
            const response = await fetch("/delete/" + id, {
                method: 'DELETE',
            });
            return await response.json();
        },
        add: async (booking) => {
            const response = await fetch("/insert", {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ booking: booking })
            });
            return await response.json();
        }
    };
};