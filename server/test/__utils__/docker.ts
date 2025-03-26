import exec from '@sliit-foss/actions-exec-wrapper';

/**
 * @description Pulls and runs a docker container image if not already present
 * @param image The image to pull and run
 * @param port The default and exposed port of the container
 */
export const runDockerContainer = (image: string, port: number) => {
  exec(
    `sh -c "docker rm -f ${image} >/dev/null 2>&1 && docker run -d --name ${image} -p ${port}:${port} ${image} >/dev/null 2>&1"`
  );
};

/**
 * @description Stops and removes a docker container if running
 * @param name The name of the container to remove
 */
export const removeDockerContainer = (name: string) => {
  exec(`sh -c "docker rm -f ${name} >/dev/null 2>&1"`);
};
