export async function uriToBlob(uri: string, name: string) {
  const response = await fetch(uri);

  const blob = await response.blob();
  const file = new File([blob], name);
  return file;
}
