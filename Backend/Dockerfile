# Utiliser l'image de base SDK pour .NET 8.0 afin de construire l'application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copier le fichier .csproj et restaurer les dépendances
COPY ["OnlineShopApi/OnlineShopApi.csproj", "OnlineShopApi/"]
RUN dotnet restore "OnlineShopApi/OnlineShopApi.csproj"

# Copier le reste du code et construire le projet
COPY . .
WORKDIR "/src/OnlineShopApi"
RUN dotnet publish "OnlineShopApi.csproj" -c Release -o /app/publish

# Utiliser une image plus légère pour exécuter l'application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Exposer le port 7223 sur lequel ton application fonctionne
EXPOSE 7223

# Définir la commande d'entrée
ENTRYPOINT ["dotnet", "OnlineShopApi.dll"]
