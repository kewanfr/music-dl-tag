echo "Updating code from git..."
git pull
echo "Restarting server..."
pm2 restart all
echo "Update complete."
pm2 logs $1