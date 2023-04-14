import { goto, invalidateAll } from '$app/navigation';

interface RequestData {
  id?: number;
  [propName: string]: any;
}

export const send = async (
  method: string,
  data: RequestData,
  appName: string
) => {
  let resource = `/api/${appName}`;

  if (method === 'PATCH' || method === 'DELETE') {
    resource += `/${data.id}`;
  }

  delete data.id;

  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (method === 'POST' || method === 'PATCH') {
    Object.assign(options, { body: JSON.stringify(data) });
  }

  await fetch(resource, options)
    .then(response => {
      if (!response.ok) {
        response.json()
        .then(json => console.error(json));
        throw new Error(response.statusText);
      }
      if (method === 'POST') {
        const newResource = response.headers.get('Location');
        if (newResource) {
          goto(newResource);
        }
        return;
      }
      if (method === 'PATCH') {
        if ('slug' in data) {
          goto(`/admin/${appName}/${data.slug}`);
          return;
        }
        invalidateAll();
        return;
      }
      if (method === 'DELETE') {
        invalidateAll();
        return;
      }
    })
    .catch(error => console.error(error));
};
