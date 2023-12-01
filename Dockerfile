#Get Node 14.15.3 From DockerHub
FROM node:14.15.3

#Copy all files in current folder into Docker Container
COPY . .

#Install Packages using NPM
RUN npm install

#Exposing the running Web_Tier application at port 3000
EXPOSE 3000

#Starting the Web_Tier Application
CMD ["npm","start"]
