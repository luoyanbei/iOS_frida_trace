//
//  ViewController.m
//  TestFrida
//
//  Created by King on 2019/8/6.
//  Copyright © 2019年 King. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    [self buildButtons];
    
}

-(void)buildButtons
{
    self.view.backgroundColor = [UIColor orangeColor];
    UIView * btnView = [[UIView alloc] initWithFrame:CGRectMake(0, UIScreen.mainScreen.bounds.size.height-150, UIScreen.mainScreen.bounds.size.width, 100)];
    btnView.backgroundColor = [UIColor lightGrayColor];
    
    [self.view addSubview:btnView];
    
    float space_left = 10.0;
    float space_top = 10.0;
    float space_interval = 10.0;
    float btn_width = 80.0;
    
    
    UIButton * hair_1_btn = [[UIButton alloc] initWithFrame:CGRectMake(space_left, space_top, btn_width, btn_width)];
    [hair_1_btn setImage:[UIImage imageNamed:@"artstyledefault_b_hair_27_icon@2x.png"] forState:UIControlStateNormal];
    [hair_1_btn setTitle:@"1" forState:UIControlStateNormal];
    hair_1_btn.tag = 1;
    hair_1_btn.backgroundColor = [UIColor redColor];
    [hair_1_btn addTarget:self action:@selector(btnClick:) forControlEvents:UIControlEventTouchUpInside];
    [btnView addSubview:hair_1_btn];
    
    UIButton * hair_2_btn = [[UIButton alloc] initWithFrame:CGRectMake(space_left+btn_width+space_interval, space_top, btn_width, btn_width)];
    [hair_2_btn setImage:[UIImage imageNamed:@"artstyledefault_b_hair_21_icon@2x.png"] forState:UIControlStateNormal];
    [hair_2_btn setTitle:@"2" forState:UIControlStateNormal];
    hair_2_btn.tag = 2;
    hair_2_btn.backgroundColor = [UIColor redColor];

    [hair_2_btn addTarget:self action:@selector(btnClick:) forControlEvents:UIControlEventTouchUpInside];
    [btnView addSubview:hair_2_btn];
    
    UIButton * hair_3_btn = [[UIButton alloc] initWithFrame:CGRectMake(space_left+(btn_width+space_interval)*2, space_top, btn_width, btn_width)];
    [hair_3_btn setImage:[UIImage imageNamed:@"artstyledefault_b_hair_30_icon@2x.png"] forState:UIControlStateNormal];
    [hair_3_btn setTitle:@"3" forState:UIControlStateNormal];
    hair_3_btn.tag = 3;
    hair_3_btn.backgroundColor = [UIColor redColor];

    [hair_3_btn addTarget:self action:@selector(btnClick:) forControlEvents:UIControlEventTouchUpInside];
    [btnView addSubview:hair_3_btn];
    
    
}

-(void)btnClick:(UIButton *)btn
{
    [self gainStudentInfo:btn.titleLabel.text];
}


-(void)gainStudentInfo:(NSString *)uid
{
    NSString * name = [self gainUserName:uid];
    int age = [self gainAge:uid];
    long long tmp = [self testLongLong:age];
    NSLog(@"%@---%d---%lld",name,age,tmp);
    
}

-(int)gainAge:(NSString *)uid
{
    int uid2 = [uid intValue];
    if(uid2 == 1)
    {
        return 19;
    }
    else if(uid2 == 2)
    {
        return 20;
    }
    else
    {
        return 21;
    }

}


-(NSString *)gainUserName:(NSString *)uid
{
    int uid2 = [uid intValue];
    if(uid2 == 1)
    {
        return @"student_01";
    }
    else if(uid2 == 2)
    {
        return @"student_02";

    }
    else
    {
        return @"student_03";
    }
    
}


-(long long)testLongLong:(int)num
{
    // long long的最大值：9223372036854775807
    long long tmp = 100000000000+num;
    NSLog(@"-------微信公众号:逆向APP--------");
    return tmp;
}

@end
