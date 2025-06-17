# Etapa de construcción
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /bienesoft

EXPOSE 80
EXPOSE 5000


COPY ./*.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /bienesoft

COPY --from=build /bienesoft/out . 


ENTRYPOINT ["dotnet", "bienesoft.dll"]
