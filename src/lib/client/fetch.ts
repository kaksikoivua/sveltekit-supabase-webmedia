import { goto, invalidateAll } from '$app/navigation';

export const patch = async (data: object, id: number, mediaType: string) => {
  await fetch(`/api/${mediaType}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        response.json()
        .then(json => console.error(json));
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(json => {
      console.log(json);
      if ('slug' in data) {
        goto(`/admin/${mediaType}/${data.slug}`);
        return;
      }
      invalidateAll();
    })
    .catch(error => console.error(error));
};
