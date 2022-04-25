FROM node:14 as img2
WORKDIR /back-school
COPY ./back-school/package.json /back-school
RUN npm install
COPY ./back-school /back-school/
CMD npm run start

