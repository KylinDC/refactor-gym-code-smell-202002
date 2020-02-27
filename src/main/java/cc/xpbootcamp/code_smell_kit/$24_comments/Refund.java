....

/**
     * 根据需要退货的 CSV 文件内容,生成需要被从数据库 CouchBase 删除的 Barcode
     * <br/>
     * CSV文件内容如下:
     * PromotionId, MemberId, Star
     * 1-ExxxXTL,1-ExxxOOA,xx
     * 1-ExxxEMP,1-7xxxH2G,xx
     * <br/>
     * 业务逻辑:
     * 1. 根据 MemberId 在数据库找到对应的 Barcode
     * 2. 根据 Barcode 信息中的用户兑换的活动阶段索引信息 stageId
     * 3. 根据 PromotionId 和 stageId 获取 Barcode 所兑换的活动阶段详情
     * 4. 判断 CSV 数据中最新的 Star 是否仍然满足 Barcode 所兑换的活动阶段需要的 Star 数量
     * 5. 返回不满足上一步条件的 Barcode,即
     * <br/>
     * @param refunds CSV文件被解析后的每一条 RefundRequestSchema 数据
     * @return 需要被从数据库 Couchbase 删除的 Barcode
     */
    public Flux<Barcode> getNeedCanceledBarcodeFluxBy(Flux<RefundRequestSchema> refunds) {
        return refunds
            .flatMap(refundRequestSchema -> barcodeService
                .existedBarcode(refundRequestSchema.getCustomerId(), refundRequestSchema.getPromotionId())
                .filterWhen(barcode -> miniPromotionService
                    .ofCrmId(refundRequestSchema.getPromotionId())
                    .filter(miniPromotion -> {
                        List<MiniPromotionStage> stages = miniPromotion.getStages();
                        Short currentStageId = barcode.getStageId();
                        if (stages.size() > currentStageId) {
                            return !isCurrentStageMatchStars(stages, currentStageId, refundRequestSchema.getStar());
                        } else {
                            return false;
                        }
                    }).hasElement()
                ));
    }
    
 ....
