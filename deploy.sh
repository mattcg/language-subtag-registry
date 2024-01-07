git config --global user.email $mail
git config --global user.name $name
git remote set-url origin https://$username:$token@github.com/$username/SansGirisimBayiListesi.git
if git status --porcelain | grep -q 'data*'; then 
	git add --all data/json/
	git add scripts/cache/language-subtag-registry
	git commit -am '📑 Update: Updated data'
	echo $username | echo $token | git push -f origin HEAD:master
else
	echo 'No changes detected'
fi