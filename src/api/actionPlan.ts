import type { ActionPlan, ActionPlanGenerationRequest, CalendarRegistrationResult } from "@/types/actionPlan";

// 전략 요약 생성 함수
function generateStrategySummary(actions: any[], matchedCategories: [string, string[]][], userMessage: string, conversationContext?: any): string {
  const categories = [...new Set(actions.map(action => action.category))];
  const priorities = actions.reduce((acc, action) => {
    const priority = action.priority || 'P2';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let summary = `📊 **전략 분석 요약**\n\n`;
  summary += `🎯 **주요 마케팅 영역**: ${categories.join(', ')}\n`;
  summary += `⚡ **우선순위 분포**: `;
  if (priorities.P0) summary += `긴급(${priorities.P0}개) `;
  if (priorities.P1) summary += `중요(${priorities.P1}개) `;
  if (priorities.P2) summary += `일반(${priorities.P2}개)`;
  summary += `\n\n`;
  
  // 사용자 질문 기반 전략 분석
  summary += `💡 **전략적 접근**: `;
  
  if (categories.includes('소셜미디어')) {
    summary += `디지털 네이티브 세대를 타겟으로 한 소셜미디어 중심 마케팅으로 브랜드 인지도 향상 및 젊은 고객층 유치. `;
  }
  if (categories.includes('이벤트')) {
    summary += `체험형 이벤트와 참여형 활동을 통해 고객 참여도 증대 및 재방문 유도로 고객 충성도 강화. `;
  }
  if (categories.includes('고객관리')) {
    summary += `개인화된 고객 관리 시스템 구축으로 장기적 고객 관계 구축 및 리텐션율 향상. `;
  }
  if (categories.includes('브랜딩')) {
    summary += `일관된 브랜드 아이덴티티와 차별화된 포지셔닝으로 시장에서의 경쟁력 강화. `;
  }
  if (categories.includes('지역마케팅')) {
    summary += `지역 커뮤니티 중심의 관계형 마케팅으로 신뢰도 구축 및 입소문 마케팅 효과 창출. `;
  }
  if (categories.includes('디지털마케팅')) {
    summary += `온라인 채널 최적화를 통한 디지털 고객 접점 확대 및 매출 증대. `;
  }
  if (categories.includes('제품마케팅')) {
    summary += `차별화된 제품 전략과 시즌별 메뉴로 고객들의 지속적인 관심 유지 및 신선감 제공. `;
  }
  if (categories.includes('콘텐츠')) {
    summary += `가치 있는 콘텐츠 제공을 통한 브랜드 전문성 어필 및 SEO 효과로 자연스러운 고객 유입. `;
  }
  
  // 사용자 질문의 의도 분석
  if (userMessage.includes('신규') || userMessage.includes('유치')) {
    summary += `신규 고객 유치에 특화된 접근으로 시장 확장 및 매출 증대. `;
  }
  if (userMessage.includes('브랜드') || userMessage.includes('인지도')) {
    summary += `브랜드 인지도 향상에 중점을 둔 전략으로 장기적 브랜드 가치 증대. `;
  }
  if (userMessage.includes('지역') || userMessage.includes('근처')) {
    summary += `지역 특화 마케팅으로 로컬 시장에서의 강력한 입지 확보. `;
  }
  if (userMessage.includes('개선') || userMessage.includes('향상')) {
    summary += `기존 마케팅 활동의 개선 및 최적화를 통한 성과 향상. `;
  }
  if (userMessage.includes('경쟁') || userMessage.includes('차별화')) {
    summary += `경쟁사 대비 차별화된 전략으로 시장에서의 경쟁력 강화. `;
  }

  // 대화 맥락 반영
  if (conversationContext) {
    if (conversationContext.total_messages > 3) {
      summary += `\n\n🔄 **대화 진행 상황**: 이전 대화 내용을 바탕으로 더욱 구체화된 전략 수립. `;
    }
    if (conversationContext.previous_topics.includes('SNS') && userMessage.includes('이벤트')) {
      summary += `SNS 마케팅과 연계된 이벤트 전략으로 시너지 효과 창출. `;
    }
    if (conversationContext.previous_topics.includes('고객') && userMessage.includes('브랜드')) {
      summary += `고객 중심의 브랜드 전략으로 고객 충성도와 브랜드 가치 동시 향상. `;
    }
  }
  
  summary += `\n\n🚀 **예상 효과**: 체계적인 실행을 통해 고객 유입 증가, 브랜드 인지도 향상, 매출 증대, 고객 충성도 강화 효과 기대`;
  
  return summary;
}

// 확장된 Mock 액션 플랜 생성 함수
function getMockActionPlan(request: ActionPlanGenerationRequest): ActionPlan {
  const { messages } = request;
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // 키워드 기반 분류
  const keywords = {
    social: ['SNS', '소셜', '인스타', '페이스북', '유튜브', '틱톡'],
    event: ['이벤트', '행사', '프로모션', '세일', '할인'],
    content: ['콘텐츠', '블로그', '글', '기사', '리뷰'],
    customer: ['고객', '회원', '리텐션', '유지', '관계'],
    brand: ['브랜드', '이미지', '인지도', '홍보', 'PR'],
    digital: ['온라인', '웹', '앱', '디지털', '광고'],
    local: ['지역', '근처', '커뮤니티', '로컬', '동네'],
    product: ['상품', '메뉴', '신제품', '신메뉴', '제품']
  };

  // 키워드 매칭으로 분류 결정
  const matchedCategories = Object.entries(keywords).filter(([_, words]) => 
    words.some(word => lastMessage.toLowerCase().includes(word.toLowerCase()))
  );

  // 확장된 액션 플랜 데이터베이스
  const actionPlanDatabase = [
    // === 소셜미디어 마케팅 ===
    {
      id: 'social_insta_setup',
      title: '인스타그램 비즈니스 계정 설정',
      description: '비즈니스 계정 전환, 프로필 최적화, 연락처 정보 설정',
      strategy: '인스타그램을 통한 시각적 브랜딩으로 젊은 고객층 유치',
      category: '소셜미디어',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P0' as const,
      channel: 'Instagram',
      estimatedHours: 2
    },
    {
      id: 'social_content_calendar',
      title: '소셜미디어 콘텐츠 캘린더 제작',
      description: '월별 콘텐츠 계획, 포스팅 스케줄, 해시태그 전략 수립',
      strategy: '체계적인 콘텐츠 기획으로 일관된 브랜드 메시지 전달',
      category: '소셜미디어',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'SNS',
      estimatedHours: 4
    },
    {
      id: 'social_story_marketing',
      title: '인스타그램 스토리 마케팅',
      description: '스토리 콘텐츠 제작, 하이라이트 설정, 인터랙티브 기능 활용',
      strategy: '스토리를 통한 실시간 소통으로 고객과의 친밀감 형성',
      category: '소셜미디어',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Instagram',
      estimatedHours: 3
    },
    {
      id: 'social_influencer_collab',
      title: '인플루언서 협업 캠페인',
      description: '적합한 인플루언서 발굴, 협업 제안, 콘텐츠 리뷰 및 승인',
      strategy: '신뢰할 수 있는 인플루언서를 통한 타겟 고객에게 도달',
      category: '소셜미디어',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Influencer',
      estimatedHours: 8
    },

    // === 이벤트 마케팅 ===
    {
      id: 'event_opening_party',
      title: '오픈 이벤트 기획 및 실행',
      description: '오픈 파티 기획, 초대장 제작, 행사 진행 및 후속 관리',
      strategy: '화려한 오픈 이벤트로 지역 커뮤니티에 강한 첫인상 남기기',
      category: '이벤트',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P0' as const,
      channel: 'Event',
      estimatedHours: 16
    },
    {
      id: 'event_weekly_special',
      title: '주간 특별 이벤트 시리즈',
      description: '매주 다른 테마의 특별 이벤트 기획 및 실행',
      strategy: '정기적인 이벤트로 고객들의 재방문 동기 부여',
      category: '이벤트',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P2' as const,
      channel: 'Event',
      estimatedHours: 6
    },
    {
      id: 'event_loyalty_program',
      title: '고객 로열티 프로그램 런칭',
      description: '스탬프 카드, 포인트 시스템, VIP 혜택 프로그램 설계',
      strategy: '체계적인 보상 시스템으로 고객 충성도 향상',
      category: '이벤트',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Loyalty',
      estimatedHours: 10
    },

    // === 콘텐츠 마케팅 ===
    {
      id: 'content_blog_setup',
      title: '비즈니스 블로그 구축',
      description: '블로그 플랫폼 선택, 디자인 커스터마이징, 콘텐츠 전략 수립',
      strategy: 'SEO 최적화된 블로그로 검색 유입 고객 확보',
      category: '콘텐츠',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Blog',
      estimatedHours: 12
    },
    {
      id: 'content_recipe_series',
      title: '레시피 콘텐츠 시리즈 제작',
      description: '메뉴별 레시피, 제작 과정, 팁과 노하우 콘텐츠 제작',
      strategy: '실용적인 정보 제공으로 브랜드 전문성 어필',
      category: '콘텐츠',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P2' as const,
      channel: 'Content',
      estimatedHours: 8
    },
    {
      id: 'content_customer_stories',
      title: '고객 스토리 콘텐츠 제작',
      description: '고객 인터뷰, 후기 수집, 스토리텔링 콘텐츠 제작',
      strategy: '실제 고객 경험을 통한 신뢰도 구축 및 감정적 연결',
      category: '콘텐츠',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P2' as const,
      channel: 'Story',
      estimatedHours: 6
    },

    // === 고객 관리 ===
    {
      id: 'customer_crm_setup',
      title: '고객 관리 시스템 구축',
      description: 'CRM 도구 선택, 고객 데이터베이스 구축, 관리 프로세스 설계',
      strategy: '체계적인 고객 정보 관리로 개인화된 서비스 제공',
      category: '고객관리',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P0' as const,
      channel: 'CRM',
      estimatedHours: 8
    },
    {
      id: 'customer_feedback_system',
      title: '고객 피드백 수집 시스템',
      description: '피드백 폼 제작, 수집 채널 구축, 개선사항 추적',
      strategy: '고객의 목소리를 듣고 지속적인 서비스 개선',
      category: '고객관리',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Feedback',
      estimatedHours: 4
    },
    {
      id: 'customer_referral_program',
      title: '추천 고객 프로그램 운영',
      description: '추천 보상 시스템 설계, 추천 코드 발급, 추천 현황 추적',
      strategy: '기존 고객의 추천을 통한 신규 고객 유치 비용 절약',
      category: '고객관리',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Referral',
      estimatedHours: 6
    },

    // === 브랜딩 ===
    {
      id: 'brand_identity_design',
      title: '브랜드 아이덴티티 디자인',
      description: '로고 디자인, 컬러 팔레트, 타이포그래피, 브랜드 가이드라인 제작',
      strategy: '일관된 시각적 아이덴티티로 브랜드 인지도 향상',
      category: '브랜딩',
      process: ['셋팅하기', '디자인하기', '운영하기'],
      priority: 'P0' as const,
      channel: 'Brand',
      estimatedHours: 16
    },
    {
      id: 'brand_packaging_design',
      title: '포장 디자인 및 브랜딩',
      description: '테이크아웃 포장, 일회용품, 기념품 디자인 제작',
      strategy: '브랜드 경험을 포장을 통해 지속적으로 전달',
      category: '브랜딩',
      process: ['셋팅하기', '디자인하기', '운영하기'],
      priority: 'P1' as const,
      channel: 'Packaging',
      estimatedHours: 10
    },
    {
      id: 'brand_partnership',
      title: '지역 브랜드 파트너십',
      description: '지역 업체와의 협업, 크로스 프로모션, 공동 이벤트 기획',
      strategy: '지역 커뮤니티와의 협력을 통한 상호 성장',
      category: '브랜딩',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P2' as const,
      channel: 'Partnership',
      estimatedHours: 8
    },

    // === 디지털 마케팅 ===
    {
      id: 'digital_google_my_business',
      title: '구글 마이 비즈니스 최적화',
      description: '구글 비즈니스 프로필 설정, 리뷰 관리, 포스트 작성',
      strategy: '구글 검색에서의 지역 검색 노출 최대화',
      category: '디지털마케팅',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P0' as const,
      channel: 'Google',
      estimatedHours: 4
    },
    {
      id: 'digital_seo_optimization',
      title: '웹사이트 SEO 최적화',
      description: '키워드 리서치, 메타 태그 최적화, 콘텐츠 SEO 적용',
      strategy: '검색 엔진 최적화를 통한 자연스러운 온라인 노출',
      category: '디지털마케팅',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'SEO',
      estimatedHours: 12
    },
    {
      id: 'digital_online_ordering',
      title: '온라인 주문 시스템 구축',
      description: '온라인 주문 플랫폼 연동, 결제 시스템 설정, 배달 관리',
      strategy: '디지털 채널을 통한 매출 증대 및 고객 편의성 향상',
      category: '디지털마케팅',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P0' as const,
      channel: 'Online',
      estimatedHours: 16
    },

    // === 지역 마케팅 ===
    {
      id: 'local_community_engagement',
      title: '지역 커뮤니티 참여 활동',
      description: '지역 행사 참여, 후원 활동, 커뮤니티 이벤트 주최',
      strategy: '지역 사회 일원으로서의 역할을 통한 브랜드 신뢰도 구축',
      category: '지역마케팅',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P2' as const,
      channel: 'Community',
      estimatedHours: 8
    },
    {
      id: 'local_business_networking',
      title: '지역 비즈니스 네트워킹',
      description: '지역 상공회의소 참여, 비즈니스 미팅, 네트워킹 이벤트 참석',
      strategy: '지역 비즈니스 커뮤니티와의 관계 구축으로 협업 기회 확대',
      category: '지역마케팅',
      process: ['셋팅하기', '운영하기', '모니터링하기'],
      priority: 'P2' as const,
      channel: 'Networking',
      estimatedHours: 6
    },
    {
      id: 'local_flyer_distribution',
      title: '지역 전단지 배포 캠페인',
      description: '전단지 디자인, 배포 지역 선정, 배포 효과 측정',
      strategy: '지역 주민들에게 직접적인 홍보 메시지 전달',
      category: '지역마케팅',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Flyer',
      estimatedHours: 10
    },

    // === 제품 마케팅 ===
    {
      id: 'product_seasonal_menu',
      title: '시즌별 특별 메뉴 개발',
      description: '계절별 신메뉴 기획, 레시피 개발, 마케팅 전략 수립',
      strategy: '계절의 변화에 맞춘 새로운 경험으로 고객 관심 유지',
      category: '제품마케팅',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Menu',
      estimatedHours: 12
    },
    {
      id: 'product_signature_item',
      title: '시그니처 메뉴 브랜딩',
      description: '대표 메뉴 선정, 스토리텔링, 브랜딩 및 마케팅',
      strategy: '독특한 시그니처 메뉴로 브랜드 차별화 및 기억도 향상',
      category: '제품마케팅',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P0' as const,
      channel: 'Signature',
      estimatedHours: 14
    },
    {
      id: 'product_limited_edition',
      title: '한정판 메뉴 출시',
      description: '한정판 메뉴 기획, 제작, 마케팅 및 판매 관리',
      strategy: '한정성과 희소성을 통한 고객들의 긴급 구매 동기 부여',
      category: '제품마케팅',
      process: ['셋팅하기', '디자인하기', '운영하기', '모니터링하기'],
      priority: 'P1' as const,
      channel: 'Limited',
      estimatedHours: 8
    }
  ];

  // 키워드 매칭에 따른 액션 플랜 생성
  let selectedActions = actionPlanDatabase;
  
  if (matchedCategories.length > 0) {
    // 매칭된 카테고리의 액션들을 우선 선택
    selectedActions = actionPlanDatabase.filter(action => 
      matchedCategories.some(([category, _]) => action.category.includes(category))
    );
  }

  // 무작위로 8-12개 선택 (키워드 매칭이 없으면 기본 액션들)
  const shuffled = [...selectedActions].sort(() => 0.5 - Math.random());
  const selectedCount = Math.min(shuffled.length, Math.floor(Math.random() * 5) + 8);
  const finalActions = shuffled.slice(0, selectedCount);

  // 날짜와 시간 설정
  const now = Date.now();
  const items = finalActions.map((action, index) => {
    const startDate = new Date(now + (index + 1) * 24 * 60 * 60 * 1000);
    startDate.setHours(10, 0, 0, 0);
    
    const endDate = new Date(startDate.getTime() + action.estimatedHours * 60 * 60 * 1000);

    return {
      id: `${action.id}_${Date.now()}`,
      title: action.title,
      description: `${action.description} | 전략: ${action.strategy} | 과정: ${action.process.join(' → ')}`,
      start: startDate.toISOString().replace('Z', '+09:00'),
      end: endDate.toISOString().replace('Z', '+09:00'),
      priority: action.priority,
      channel: action.channel,
      reminders: [{ minutes_before: 30 }],
      notes: `분류: ${action.category} | 예상 소요시간: ${action.estimatedHours}시간`
    };
  });

  // 전략 요약 생성 (대화 맥락 포함)
  const conversationContext = request.user_context?.conversation_context;
  const strategySummary = generateStrategySummary(finalActions, matchedCategories, lastMessage, conversationContext);

  // 플랜 제목에 대화 진행 상황 반영
  let planTitle = `💡 ${matchedCategories.length > 0 ? matchedCategories.map(([cat, _]) => cat).join(', ') : '종합'} 마케팅 액션 플랜`;
  
  if (conversationContext && conversationContext.total_messages > 2) {
    planTitle += ` (대화 진행 중)`;
  }
  
  planTitle += ` (${new Date().toLocaleDateString('ko-KR')})`;

  return {
    plan_title: planTitle,
    items: items,
    strategy_summary: strategySummary,
  };
}

// OpenAI API를 직접 호출하는 함수
async function callOpenAI(request: ActionPlanGenerationRequest): Promise<ActionPlan> {
  const { messages, user_context } = request;

  // 대화 내용을 분석하여 마케팅 액션 플랜 생성 프롬프트 구성 (최적화)
  const systemPrompt = `마케팅 전문가로서 대화를 분석해 구체적이고 실행 가능한 액션 플랜과 전략 요약을 JSON으로 생성하세요.

응답 형식:
{
  "plan_title": "플랜 제목",
  "strategy_summary": "전략 분석 요약 (왜 이런 액션들이 필요한지 설명)",
  "items": [
    {
      "id": "unique_id",
      "title": "액션 제목",
      "description": "간단 설명 | 전략: 왜 필요한지 | 과정: 셋팅하기→디자인하기→운영하기→모니터링하기",
      "start": "2024-01-15T10:00:00+09:00",
      "end": "2024-01-15T11:00:00+09:00",
      "all_day": false,
      "priority": "P0",
      "channel": "SNS",
      "reminders": [{"minutes_before": 30}],
      "notes": "분류: 카테고리 | 예상 소요시간: X시간"
    }
  ]
}

규칙:
- 날짜: Asia/Seoul 타임존 (+09:00)
- 우선순위: P0(긴급), P1(중요), P2(일반)
- 채널: SNS, EDM, Blog, Event, Instagram, Google 등
- 분류: 소셜미디어, 이벤트, 콘텐츠, 고객관리, 브랜딩, 디지털마케팅, 지역마케팅, 제품마케팅
- 3-7개 액션 아이템 생성
- strategy_summary는 왜 이런 액션들이 선택되었는지 전략적 근거 설명
- 대화 내용 반영하여 개인화`;

  // 대화 맥락을 고려한 프롬프트 구성
  const conversationContext = user_context?.conversation_context;
  const recentMessages = (conversationContext?.total_messages || 0) > 3 ? messages.slice(-4) : messages.slice(-3);
  
  let userPrompt = `대화 분석하여 액션 플랜 생성:

${recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

비즈니스: ${user_context?.business_type || '일반'}
현재 시간: ${new Date().toISOString().split('T')[0]}`;

  // 대화 맥락 추가
  if (conversationContext) {
    userPrompt += `\n\n대화 맥락:
- 총 메시지 수: ${conversationContext.total_messages}개
- 현재 질문: ${conversationContext.current_focus}
- 이전 주제들: ${conversationContext.previous_topics.slice(0, 200)}...

이전 대화를 고려하여 더욱 구체적이고 연관성 있는 액션 플랜을 생성해주세요.`;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5, // 더 빠른 응답을 위해 낮춤
      max_tokens: 1200, // 토큰 수 줄여서 응답 시간 단축
      stream: false, // 스트리밍 비활성화로 안정성 확보
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API 오류: ${error}`);
  }

  const data = await response.json();
  const responseText = data.choices[0]?.message?.content;
  
  if (!responseText) {
    throw new Error('OpenAI 응답이 비어있습니다');
  }

  const actionPlan: ActionPlan = JSON.parse(responseText);

  // 응답 검증
  if (!actionPlan.plan_title || !Array.isArray(actionPlan.items)) {
    throw new Error('생성된 액션 플랜 형식이 올바르지 않습니다');
  }

  // 각 아이템에 고유 ID가 없으면 생성
  actionPlan.items = actionPlan.items.map((item, index) => ({
    ...item,
    id: item.id || `action_${Date.now()}_${index}`,
  }));

  return actionPlan;
}

// AI 액션 플랜 생성 API
export async function generateActionPlan(request: ActionPlanGenerationRequest): Promise<ActionPlan> {
  // OpenAI API 키가 있으면 실제 GPT API 호출
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    console.log('🤖 OpenAI API 직접 호출');
    try {
      return await callOpenAI(request);
    } catch (error) {
      console.error('OpenAI API 호출 실패:', error);
      console.log('🔄 Mock 데이터로 대체');
      return getMockActionPlan(request);
    }
  }

  // OpenAI API 키가 없으면 Mock 데이터 사용
  if (import.meta.env.DEV) {
    console.log('🎭 개발 모드: Mock 데이터 사용 (VITE_OPENAI_API_KEY를 설정하면 실제 GPT API 호출)');
    return getMockActionPlan(request);
  }

  // 프로덕션 환경에서는 서버리스 함수 사용
  console.log('🚀 프로덕션 모드: 서버리스 함수 호출');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch('/api/action-plan/generate', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.error || `API 호출 실패 (${response.status})`);
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    }
    throw error;
  }
}

// Google Calendar에 액션 플랜 등록 API
export async function registerActionPlanToCalendar(
  actionPlan: ActionPlan,
  accessToken: string
): Promise<CalendarRegistrationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('/api/action-plan/register-calendar', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(actionPlan),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.error || `캘린더 등록 실패 (${response.status})`);
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('캘린더 등록 시간이 초과되었습니다.');
    }
    throw error;
  }
}

