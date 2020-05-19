ENV_KEY=$1;
BUILD_DIR=$2;
SSH=$(cat deploy.$ENV_KEY.json | jq ".ssh" | sed 's/\"//g');
DEPLOY_DIR=$(cat deploy.$ENV_KEY.json | jq ".deploy_dir" | sed 's/\"//g');
BACKUP_DIR=$(cat deploy.$ENV_KEY.json | jq ".backup_dir" | sed 's/\"//g');
RELEASE_NAME=$(cat deploy.$ENV_KEY.json | jq ".release_name" | sed 's/\"//g');
DATE=$(date +%Y%m%d%H%M%S);
echo "SSH => $SSH"
echo "DEPLOY_DIR => $DEPLOY_DIR"
echo "BACKUP_DIR => $BACKUP_DIR"
echo "RELEASE_NAME => $RELEASE_NAME"

echo 'Web备份';
echo "ssh $SSH \"mkdir -p '$BACKUP_DIR/$DATE'\"";
ssh $SSH "mkdir -p '$BACKUP_DIR/$DATE'";
echo "ssh $SSH \"cp -R '$DEPLOY_DIR' '$BACKUP_DIR/$DATE'\"";
ssh $SSH "cp -R '$DEPLOY_DIR' '$BACKUP_DIR/$DATE'";

echo '清空部署目录后重建';
echo "ssh $SSH 'rm -rf $DEPLOY_DIR'";
ssh $SSH "rm -rf '$DEPLOY_DIR'";
echo "ssh $SSH 'mkdir -p $DEPLOY_DIR'";
ssh $SSH "mkdir -p '$DEPLOY_DIR'";

echo '拷贝文件到服务器';
echo "scp -r '$BUILD_DIR/$RELEASE_NAME.zip' $SSH:$DEPLOY_DIR";
scp -r "$BUILD_DIR/$RELEASE_NAME.zip" $SSH:$DEPLOY_DIR 

echo '解压缩';
echo "ssh $SSH 'unzip -o $DEPLOY_DIR/$RELEASE_NAME.zip -d $DEPLOY_DIR'";
ssh $SSH "unzip -o '$DEPLOY_DIR/$RELEASE_NAME.zip' -d '$DEPLOY_DIR'";

echo '删除压缩包';
echo "ssh $SSH 'rm -f $DEPLOY_DIR/$RELEASE_NAME.zip'";
ssh $SSH "rm -f $DEPLOY_DIR/$RELEASE_NAME.zip";
